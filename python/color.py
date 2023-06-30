import cv2
import numpy as np
from sklearn.cluster import KMeans


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


def averageColor(path):

    src_image = cv2.imread(path)
    print(path)
    src_image = cv2.cvtColor(src_image, cv2.COLOR_BGR2RGB)
    reshape_img = src_image.reshape(
        (src_image.shape[0] * src_image.shape[1], 3))
    cluster = KMeans(n_clusters=1).fit(reshape_img)
    C_centroids = cluster.cluster_centers_

    C_labels = np.arange(0, len(np.unique(cluster.labels_)) + 1)
    (C_hist, _) = np.histogram(cluster.labels_, bins=C_labels)
    C_hist = C_hist.astype("float")
    C_hist /= C_hist.sum()

    img_colors = sorted([(percent, color)
                        for (percent, color) in zip(C_hist, C_centroids)])

    return lightness(rgb2hsl({"r": round(img_colors[0][1][0], 2), "g": round(img_colors[0][1][1], 2), "b": round(img_colors[0][1][2], 2)}))
