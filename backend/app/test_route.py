import osmnx as ox
import networkx as nx

# Load saved graph
graph = ox.load_graphml("delhi_roads.graphml")

# Example coordinates
origin = ox.distance.nearest_nodes(graph, 77.2090, 28.6139)
destination = ox.distance.nearest_nodes(graph, 77.1025, 28.7041)

route = nx.shortest_path(graph, origin, destination, weight="length")

ox.plot_graph_route(graph, route)
