from flask import Flask, jsonify, render_template, request
from flask_cors import CORS
import redis
import json

app = Flask(__name__, template_folder='templates')
CORS(app)

def connection_db():
    """Crear conexion a la base de datos"""
    conexion = redis.StrictRedis(host='db-geolo', port=6379, db=0, decode_responses=True)
    if(conexion.ping()):
        print("Conectado al servidor de redis")
    else:
        print("Error...")
    return conexion 

client = connection_db()

"""Inicializamos los contenedores solo la primera vez luego de su ejecucion"""
@app.before_first_request
def before_first_request():
    response = initializePoints()
    return response


@app.route('/points/initialize')    
def initializePoints():
    """Funcion para inicializar los puntos de interes"""
    response =  client.exists('Cervecerias')
    if(response == 0):
        client.geoadd('Cervecerias',-58.233936,-32.480512,'Drakkar',-58.248289,-32.477120,'Lagash',-58.237977,-32.481038,'Tractor', -58.235348, -32.479827, '7 Colinas')
        client.geoadd('Universidades',-58.2355213,-32.479067,'Uader Fcyt',-58.2305606,-32.4846711,'Uader Fhaycs',-58.2318001,-32.4958,'Utn Frcu')
        client.geoadd('Farmacias',-58.2351599,-32.4862249,'Alberdi',-58.2331543,-32.486659,'Suarez',-58.2366414,-32.485827,'Argentina')
        client.geoadd('Emergencias',-58.2369422,-32.4842218,'Alerta',-58.2331737,-32.483037,'Vida',-58.2389064,-32.479766,'Cooperativa medica')
        client.geoadd('Supermercados',-58.232506,-32.4892655,'Gran Rex',-58.2439911,-32.4885239,'Dia',-58.246514,-32.4744789,'Impulso')
        client.lpush('Cervecerias List', 'Drakkar', 'Lagash', 'Tractor', '7 Colinas')
        client.lpush('Universidades List', 'Uader Fcyt', 'Uader Fhaycs', 'Utn Frcu')
        client.lpush('Farmacias List', 'Alberdi', 'Suarez', 'Argentina')
        client.lpush('Emergencias List', 'Alerta', 'Vida', 'Cooperativa medica')
        client.lpush('Supermercados List', 'Gran Rex', 'Dia', 'Impulso')

    return "Puntos de interes cargados con exito"

@app.route('/location/add/<point>/<longitude>/<latitude>/<name>', methods=['GET'])
def addInterestPoint(point, longitude, latitude, name):
    """Agregamos un punto de interes teniendo en cuenta clasificacion (cerveceria, farmacia, etc), longitud, latitud y el nombre del lugar.
        Tambien creamos una lista categorizando los puntos de interes y guardando los nombres dentro."""

    places = client.lrange(point+" List", 0, -1)
    if(name not in places):
        response = client.geoadd(point.capitalize(), longitude, latitude, name.capitalize())
        if(response==1):
            client.lpush(point.capitalize()+" List", name.capitalize())
            return name.capitalize()
        else:
            return "Error"
    else:
        return "Error"

@app.route('/user-radio/places/<longitude>/<latitude>')
def placesByRadio(longitude, latitude):
    """Obtenemos los lugares que estan a X km de la ubicacion de un usuario. Longitude y latitude son las coordenadas del usuario que consulta"""
    x = 80
    points = getPoints()
    response = []
    for point in points:
        response.append(client.georadius(point.capitalize(), longitude, latitude, x, unit='km', withdist=True))
    return jsonify(response)


def getPoints():
    """Obtenemos todos los puntos de interes"""
    points = []
    all_points = client.keys('*')
    for ap in all_points:
        points.append(ap.split(' List')[0])    
    points = list(dict.fromkeys(points))
    return points

@app.route('/places/list', methods=['GET'])
def getPlacesList():
    """Retornamos un listado con todos los lugares almacenados"""
    points = getPoints()
    places_with_coords = []
    for p in points:
        places_names = client.lrange(p+" List", 0, -1)
        for pn in places_names:
            coords = client.geopos(p,pn)        #coords[0][0] corresponde a la longitud y coords[0][1] a la latitud
            pwc = {'name': pn, 'lng': coords[0][0], 'lat': coords[0][1]}
            places_with_coords.append(pwc)
            
    return jsonify(places_with_coords)

if __name__ == '__main__':
    app.run(host='backend', port='5000', debug=False)