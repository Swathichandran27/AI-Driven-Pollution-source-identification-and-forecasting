import osmnx as ox
import networkx as nx
import pandas as pd
import numpy as np
from scipy.spatial import cKDTree
import matplotlib.pyplot as plt

print("Loading Delhi road network...")

G = ox.load_graphml("delhi_roads.graphml")
graph = G.copy()   # KEEP MultiDiGraph

nodes, edges = ox.graph_to_gdfs(graph)

# ==========================================================
# 2️⃣ LOAD REAL AQI DATA (PM2.5)
# ==========================================================
print("Loading pollution data...")

pollution_df = pd.read_csv(r"D:\miniproject\AI-Driven-Pollution-source-identification-and-forecasting\ml_project\data\raw\real_time_aqi_data.csv")
pollution_df = pollution_df[pollution_df["pollutant_id"] == "PM2.5"]
pollution_df = pollution_df[["latitude", "longitude", "avg_value"]]

# ==========================================================
# 3️⃣ MAP POLLUTION TO NODES
# ==========================================================
print("Mapping pollution to nodes...")

station_coords = pollution_df[["longitude", "latitude"]].values
tree = cKDTree(station_coords)

node_coords = nodes[["x", "y"]].values
_, indices = tree.query(node_coords)

nodes["pollution"] = pollution_df.iloc[indices]["avg_value"].values

max_poll = nodes["pollution"].max()
nodes["pollution_norm"] = nodes["pollution"] / max_poll

nx.set_node_attributes(graph, nodes["pollution"].to_dict(), "pollution")
nx.set_node_attributes(graph, nodes["pollution_norm"].to_dict(), "pollution_norm")

# ==========================================================
# 4️⃣ CREATE EDGE WEIGHTS
# ==========================================================
print("Creating edge weights...")

ALPHA = 30   # Pollution importance factor

for u, v, k, data in graph.edges(keys=True, data=True):

    pollution_factor = (
        graph.nodes[u]["pollution_norm"] +
        graph.nodes[v]["pollution_norm"]
    ) / 2

    length = data["length"]

    # Pure pollution cost (not multiplied twice)
    data["pollution_weight"] = pollution_factor

    # Balanced cost
    data["balanced_weight"] = length + (ALPHA * pollution_factor * length)

# ==========================================================
# 5️⃣ USER INPUT
# ==========================================================
print("\nEnter Source Latitude (28.x):")
src_lat = float(input())

print("Enter Source Longitude (77.x):")
src_lon = float(input())

print("\nEnter Destination Latitude:")
dest_lat = float(input())

print("Enter Destination Longitude:")
dest_lon = float(input())

origin = ox.distance.nearest_nodes(graph, src_lon, src_lat)
destination = ox.distance.nearest_nodes(graph, dest_lon, dest_lat)

# ==========================================================
# 6️⃣ A* HEURISTIC
# ==========================================================
def heuristic(u, v):
    x1, y1 = graph.nodes[u]['x'], graph.nodes[u]['y']
    x2, y2 = graph.nodes[v]['x'], graph.nodes[v]['y']
    return ((x1 - x2)**2 + (y1 - y2)**2) ** 0.5

# ==========================================================
# 7️⃣ ROUTE GENERATION USING A*
# ==========================================================
print("\nGenerating routes using A*...")

shortest_path = nx.astar_path(
    graph, origin, destination,
    heuristic=heuristic,
    weight="length"
)

least_pollution_path = nx.astar_path(
    graph, origin, destination,
    heuristic=heuristic,
    weight="pollution_weight"
)

balanced_path = nx.astar_path(
    graph, origin, destination,
    heuristic=heuristic,
    weight="balanced_weight"
)

# ==========================================================
# 8️⃣ METRIC CALCULATION
# ==========================================================
def calculate_metrics(route):

    total_distance = 0
    exposure = 0

    for u, v in zip(route[:-1], route[1:]):
        edge_data = graph.get_edge_data(u, v)
        edge_data = edge_data[list(edge_data.keys())[0]]

        length = edge_data["length"]

        pollution = (
            graph.nodes[u]["pollution"] +
            graph.nodes[v]["pollution"]
        ) / 2

        total_distance += length
        exposure += pollution * length   # realistic exposure

    return total_distance / 1000, exposure


sd, sp = calculate_metrics(shortest_path)
ld, lp = calculate_metrics(least_pollution_path)
bd, bp = calculate_metrics(balanced_path)

print("\n================ ROUTE SUGGESTIONS ================\n")

print("🚗 Shortest Route")
print("Distance:", round(sd, 2), "km")
print("Exposure:", round(sp, 2))

print("\n🌿 Least Pollution Route")
print("Distance:", round(ld, 2), "km")
print("Exposure:", round(lp, 2))

print("\n⚖️ Balanced Route (Recommended)")
print("Distance:", round(bd, 2), "km")
print("Exposure:", round(bp, 2))

print("\nDisplaying all routes clearly...")

# Plot base graph once
fig, ax = ox.plot_graph(
    graph,
    node_size=0,
    edge_color="gray",
    edge_linewidth=0.5,
    show=False,
    close=False
)

# Plot shortest (blue)
ox.plot_graph_route(
    graph,
    shortest_path,
    ax=ax,
    route_color="blue",
    route_linewidth=4,
    show=False,
    close=False
)

# Plot least pollution (green)
ox.plot_graph_route(
    graph,
    least_pollution_path,
    ax=ax,
    route_color="green",
    route_linewidth=4,
    show=False,
    close=False
)

# Plot balanced (red)
ox.plot_graph_route(
    graph,
    balanced_path,
    ax=ax,
    route_color="red",
    route_linewidth=4,
    show=False,
    close=False
)


plt.show()

print("\nDone ✅")