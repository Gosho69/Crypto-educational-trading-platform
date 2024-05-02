import json

def getJsonResponseFuncName(func, name):
    raw_data = func(name)
    raw_data_list = list(raw_data)
    json_string = raw_data_list[0].decode('utf-8')
    json_data = json.loads(json_string)
    return json_data