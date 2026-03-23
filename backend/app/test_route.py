from flask import Blueprint, request, jsonify
import osmnx as ox
import networkx as nx
import pandas as pd
from scipy.spatial import cKDTree

# 🔹 Create Blueprint
route_bp = Blueprint("route_bp", __name__)

print("🚀 Loading AeroSense Routing Engine...")

# ==========================================================
# 1️⃣ LOAD GRAPH (ONLY ONCE)
# ==========================================================
graph = ox.load_graphml(
    r"D:\miniproject\AI-Driven-Pollution-source-identification-and-forecasting\backend\delhi_roads.graphml"
)

nodes, edges = ox.graph_to_gdfs(graph)

# ==========================================================
# 2️⃣ LOAD POLLUTION DATA
# ==========================================================
pollution_df = pd.read_csv(
    r"D:\miniproject\AI-Driven-Pollution-source-identification-and-forecasting\ml_project\data\raw\real_time_aqi_data.csv"
)

pollution_df = pollution_df[pollution_df["pollutant_id"] == "PM2.5"]
pollution_df = pollution_df[["latitude", "longitude", "avg_value"]]

# ==========================================================
# 3️⃣ MAP POLLUTION TO NODES
# ==========================================================
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
# 4️⃣ EDGE WEIGHTS
# ==========================================================
ALPHA = 30

for u, v, k, data in graph.edges(keys=True, data=True):
    pollution_factor = (
        graph.nodes[u]["pollution_norm"] +
        graph.nodes[v]["pollution_norm"]
    ) / 2

    length = data["length"]

    data["pollution_weight"] = pollution_factor
    data["balanced_weight"] = length + (ALPHA * pollution_factor * length)

# ==========================================================
# 5️⃣ HEURISTIC
# ==========================================================
def heuristic(u, v):
    x1, y1 = graph.nodes[u]['x'], graph.nodes[u]['y']
    x2, y2 = graph.nodes[v]['x'], graph.nodes[v]['y']
    return ((x1 - x2)**2 + (y1 - y2)**2) ** 0.5

# ==========================================================
# 6️⃣ METRICS
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
        exposure += pollution * length

    return total_distance / 1000, exposure

# ==========================================================
# 7️⃣ MAIN ROUTE LOGIC
# ==========================================================
def get_routes(src_lat, src_lon, dest_lat, dest_lon):

    origin = ox.distance.nearest_nodes(graph, src_lon, src_lat)
    destination = ox.distance.nearest_nodes(graph, dest_lon, dest_lat)

    shortest_path = nx.astar_path(graph, origin, destination, heuristic=heuristic, weight="length")
    least_pollution_path = nx.astar_path(graph, origin, destination, heuristic=heuristic, weight="pollution_weight")
    balanced_path = nx.astar_path(graph, origin, destination, heuristic=heuristic, weight="balanced_weight")

    def route_to_coords(route):
        return [
            [graph.nodes[node]["y"], graph.nodes[node]["x"]]
            for node in route
        ]

    sd, sp = calculate_metrics(shortest_path)
    ld, lp = calculate_metrics(least_pollution_path)
    bd, bp = calculate_metrics(balanced_path)

    return {
        "shortest": {
            "path": route_to_coords(shortest_path),
            "distance": sd,
            "exposure": sp
        },
        "least_pollution": {
            "path": route_to_coords(least_pollution_path),
            "distance": ld,
            "exposure": lp
        },
        "balanced": {
            "path": route_to_coords(balanced_path),
            "distance": bd,
            "exposure": bp
        }
    }

# ==========================================================
# 8️⃣ API ENDPOINT
# ==========================================================
@route_bp.route("/route", methods=["POST"])
def route_api():
    try:
        data = request.json

        src_lat = float(data["src_lat"])
        src_lon = float(data["src_lon"])
        dest_lat = float(data["dest_lat"])
        dest_lon = float(data["dest_lon"])

        result = get_routes(src_lat, src_lon, dest_lat, dest_lon)

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500