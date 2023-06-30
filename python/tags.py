from sklearn.cluster import KMeans
from cv2 import imread, cvtColor, COLOR_BGR2RGB
from json import dumps
from os import system
from tinytag import TinyTag
from glob import glob
from numpy import arange, unique, histogram
from io import BytesIO
from base64 import encodebytes
from music_tag import load_file
import music_tag

import re

# music_tag.file.MetadataItem


databaseCreateLog = open('./../logs/database-create.log', 'w')


def rgb2hsl(rgba):
    hue = 0
    saturation = 0
    lightness = 0

    red = rgba['r'] / 255
    green = rgba['g'] / 255
    blue = rgba['b'] / 255

    colorMax = max(red, green, blue)
    colorMin = min(red, green, blue)
    delta = colorMax - colorMin

    if delta == 0:
        hue = 0
    elif colorMax == red:
        hue = (green - blue) / delta % 6
    elif colorMax == green:
        hue = (blue - red) / delta + 2
    elif colorMax == blue:
        hue = (red - green) / delta + 4

    hue = round(hue * 60)

    if hue < 0:
        hue += 360

    lightness = (colorMax + colorMin) / 2

    if delta != 0:
        saturation = delta / (1 - abs(2 * lightness - 1))

    saturation = round(+(saturation * 100), 2)
    lightness = round(+(lightness * 100), 2)

    return {'h': hue, 's': saturation, 'l': lightness, 'a': 1}


def lightness(hsla):
    if hsla['s'] < 20 and hsla['l'] < 20:
        hsla['s'] = 25
        hsla['l'] = hsla['s']
    if hsla['l'] < 20:
        hsla['l'] = 20
    if hsla['l'] > 60:
        hsla['l'] = 60
    if hsla['s'] > 60:
        hsla['s'] = 60
    return hsla


def averageColor(imagePath):
    src_image = imread(imagePath)
    src_image = cvtColor(src_image, COLOR_BGR2RGB)
    reshape_img = src_image.reshape(
        (src_image.shape[0] * src_image.shape[1], 3))
    cluster = KMeans(n_clusters=1).fit(reshape_img)
    C_centroids = cluster.cluster_centers_

    C_labels = arange(0, len(unique(cluster.labels_)) + 1)
    (C_hist, _) = histogram(cluster.labels_, bins=C_labels)
    C_hist = C_hist.astype('float')
    C_hist /= C_hist.sum()

    img_colors = sorted([(percent, color)
                        for (percent, color) in zip(C_hist, C_centroids)])

    return {'r': round(img_colors[0][1][0], 2), 'g': round(img_colors[0][1][1], 2), 'b': round(img_colors[0][1][2], 2)}


def relativeToAbsolute(minutes, seconds):
    return int(seconds) + float(minutes) * 60


def isFloat(string):
    for i in string:
        if i not in ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.']:
            return False
        pass
    return True


songInfo = []
count = 0
error = 0

for i in glob('music/*.mp3'):
    try:
        print(i)
        song = TinyTag.get(i, image=True)
        audio = load_file(i)

        imagePath = f'./Image/{song.artist} - {song.album}.png'
        with open(imagePath, 'wb') as f:
            f.write(BytesIO(song.get_image()).read())
            pass

        hsla = lightness(rgb2hsl(averageColor(imagePath)))

        lyric = {}
        if audio['lyrics']:
            # print(str(audio['lyrics']).split("\n"))
            try:
                rawLyric = str(audio['lyrics']).split('\n')
                for element in rawLyric:
                    if element == '':
                        continue
                    element = element.split(":")
                    minutes = element[0][1:]
                    seconds = element[1].split("]")[0]

                    if str(minutes).isnumeric() == False or isFloat(seconds) == False:
                        continue

                    content = str(element[1].split("]")[1]).strip()

                    lyric[f'{round(int(minutes) + float(seconds) * 60, 3)}'] = content
                    # print(lyric)
            except:
                lyric = "null"
                pass
        else:
            pass

        songInfo.append({
            'title': song.title,
            'album': song.album,
            'artist': str(song.artist).split(', '),
            'albumArtist': song.albumartist,
            'year': song.year,
            'duration': song.duration,
            'genre': song.genre,
            'cover': imagePath,
            'path': i,
            'lyric': lyric,
            'track': song.track,
            'color': hsla,
        })

        count += 1

    except:
        error += error
        pass
    pass

if error > 0:
    print('Total error : ', error)
print('Sucess : ', count)

songInfo.sort(key=lambda x: x['title'])

# print(songInfo[0]['lyric'])

# Dumping to json
with open('./../json/song-data.json', 'w') as f:
    f.write(dumps(songInfo))
    pass


# Final finishing up
databaseCreateLog.close()
