import osmnx as ox


ox.settings.log_console = True
ox.settings.use_cache = True


place = "Delhi, India"

print("Downloading road network...")
graph = ox.graph_from_place(place, network_type="drive")

print("Download completed!")
ox.save_graphml(graph, "delhi_roads.graphml")

print("Saved successfully!")

