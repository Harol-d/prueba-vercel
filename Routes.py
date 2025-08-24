from flask import Blueprint, jsonify, request
from Controllers.LmmController import lmmController
from Models.databaseVectorModel import databaseVectormodel
from Controllers.dataBaseVectorController import dataBaseVectorController
# from Models.LlmModel import ModeLlm
# from Controllers.dataBaseVectorController import DataBaseVectorController
import os

api = Blueprint('api', __name__)
llmresponse = lmmController()
dbModel  = databaseVectormodel()
dbController = dataBaseVectorController()

@api.route("/response", methods=["POST"])
def index():
    prompt = request.get_json()
    response = llmresponse.promptValidate(prompt)
    return jsonify({
        "LLM": response
    })


@api.route("/eliminar")
def eliminar():
    dbModel.eliminarRecords()
    return jsonify({
        "mensaje": "Registros eliminados correctamente"
    })

@api.route("/crear")
def crear():
    # Obtener la ruta absoluta del archivo SQL
    sql_file_path = os.path.join(os.path.dirname(__file__), 'Serviciosvirtuales.sql')
    chunks = dbController.crearChunks(sql_file_path)
    return jsonify({
        "mensaje": f"chunks creados correctamente: {chunks}"
    })
