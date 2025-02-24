import os
import gpxpy
import folium
from datetime import datetime
import json

# GPXファイルが格納されているフォルダ
input_folder = os.path.join(os.path.dirname(__file__), 'input')

points_data = []

# フォルダ内の最初のGPXファイルのみを読み込む
for filename in os.listdir(input_folder):
    if filename.endswith('.gpx'):
        filepath = os.path.join(input_folder, filename)
        with open(filepath, 'r') as gpx_file:
            gpx = gpxpy.parse(gpx_file)
            for track in gpx.tracks:
                for segment in track.segments:
                    for i, point in enumerate(segment.points):
                        if i > 0:
                            prev_point = segment.points[i - 1]
                            if point.time and prev_point.time:
                                time_diff = (point.time - prev_point.time).total_seconds()
                                distance = point.distance_3d(prev_point)
                                speed_mps = distance / time_diff if (time_diff > 0) and distance is not None else 0
                                speed = speed_mps * 3600/1000
                            else:
                                speed = 0
                        else:
                            speed = 0
                        points_data.append({
                            'time': point.time,
                            'lat': point.latitude,
                            'lng': point.longitude,
                            'ele': point.elevation,
                            'spd': speed
                        })
        break  # 最初のGPXファイルのみ処理するためループを抜ける

# 出力フォルダ
output_folder = os.path.join(os.path.dirname(__file__), 'output')
os.makedirs(output_folder, exist_ok=True)

# 出力ファイルパス
output_filepath = os.path.join(output_folder, 'points_data.json')

# 出力用オブジェクト
output_obj = {
    'points': points_data
}

# points_dataをJSON形式で出力
with open(output_filepath, 'w') as json_file:
    json.dump(output_obj, json_file, default=str, ensure_ascii=False, indent=4)
