from music_tag import load_file
from io import BytesIO
from tinytag import TinyTag
from glob import glob
from json import dumps

from os import mkdir
from os.path import exists, join

from color import averageColor


dumpDir = './../dump'

if not exists(dumpDir):
    mkdir(dumpDir)


class Audio:
    def __init__(self, path) -> None:
        self.musicSong = load_file(path)
        self.tinySong = TinyTag.get(path, image=True)
        pass

    def anyOne(self, one, two):
        if one:
            return one
        elif two:
            return two
        pass

    def title(self):
        return str(self.anyOne(self.musicSong['title'], self.tinySong.title))

    def album(self):
        return str(self.anyOne(self.musicSong['album'], self.tinySong.album))

    def artist(self):
        return str(self.anyOne(self.musicSong['artist'], self.tinySong.artist))

    def albumArtist(self):
        albumartist = self.anyOne(
            self.musicSong['albumartist'], self.tinySong.albumartist)
        if albumartist:
            return str(albumartist)
        return str(self.artist())

    def year(self):
        return str(self.anyOne(self.musicSong['year'], self.tinySong.year))

    def duration(self):
        return str(self.tinySong.duration)

    def genre(self):
        return str(self.anyOne(self.musicSong['genre'], self.tinySong.genre))

    def track(self):
        return str(self.anyOne(self.musicSong['track'], self.tinySong.track))

    def lyrics(self):
        lyric = self.musicSong['lyrics']
        if not bool(lyric):
            return

        lyric = str(lyric)

        lyricsDictonary = {}

        arrayOfLyrics = lyric.split('\n')
        for line in arrayOfLyrics:
            try:
                time_content = line.split(']')
                time = time_content[0][1:]

                time = str(
                    round(int(time.split(':')[0]) * 60 + round(float(time.split(':')[1]), 3), 3))

                content = ']'.join(time_content[1:])

                lyricsDictonary[time] = content
            except:
                pass

        return lyricsDictonary

    def cover(self):
        if self.tinySong.get_image() == None:
            return False
        imagePath = f'image/{song.albumArtist()} - {song.album()}.png'
        with open(imagePath, 'wb') as f:
            f.write(BytesIO(self.tinySong.get_image()).read())
            pass
        return imagePath
    pass


iter = 0
songInfo = []
for i in glob('music/*.mp3'):
    # for i in ['music/DJMattz - Ok Jaanu, Heat Waves.m4a']:

    song = Audio(i)

    cover = song.cover()
    color = {}
    if cover:
        color = averageColor(cover)
    else:
        cover = 'svg/music record.png'
        color = {'h': 88, 's': 91, 'l': 37, 'a': 1}

    info = {
        'title': song.title(),
        'album': song.album(),
        'artist': song.artist(),
        'albumArtist': song.albumArtist(),
        'year': song.year(),
        'duration': song.duration(),
        'genre': song.genre(),
        'lyrics': song.lyrics(),
        'color': color,
        'path': './../' + i.replace("\\", "/"),
        'cover': f'./../{cover}'

    }

    songInfo.append(info)

    # if iter == 0:
    #     break
    # iter += 1


with open('./json/song-data.json', 'w') as f:
    f.write(dumps(songInfo))
    pass
