from pymongo import MongoClient
from os import system

system('cls')


class DataBase:

    def __init__(self) -> None:

        self.HOST = 'localhost'
        self.PORT = 27017

        self.myClient = MongoClient(f'mongodb://{self.HOST}:{self.PORT}/')

        self.songInfo = self.myClient['musicly']['song-info']

        self.songInfo.insert_one({"title": "Lean On", "Artist": "DJ Snake"})

        print(self.songInfo)
        pass


db = DataBase()
