import os
import gpxpy
import folium

# GPXファイルが格納されているフォルダ
input_folder = os.path.join(os.path.dirname(__file__), 'input')

# 地図の初期設定
map_center = [0, 0]
mymap = folium.Map(location=map_center, zoom_start=2)

# フォルダ内の最初のGPXファイルのみを読み込む
for filename in os.listdir(input_folder):
    if filename.endswith('.gpx'):
        filepath = os.path.join(input_folder, filename)
        with open(filepath, 'r') as gpx_file:
            gpx = gpxpy.parse(gpx_file)
            for track in gpx.tracks:
                for segment in track.segments:
                    for point in segment.points:
                        folium.Marker(
                            location=[point.latitude, point.longitude],
                            popup=f'Lat: {point.latitude}, Lon: {point.longitude}'
                        ).add_to(mymap)
        break  # 最初のGPXファイルのみ処理するためループを抜ける

# 地図をHTMLファイルとして保存
output_folder = os.path.join(os.path.dirname(__file__), 'output')
if not os.path.exists(output_folder):
    os.makedirs(output_folder)
mymap.save(os.path.join(output_folder, 'map.html'))
