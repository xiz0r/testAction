import { ReferenceObject } from "libs/models/reference-object";
import mongoose from "mongoose";
import { isAnObjectReference } from "src/utils/utils"
const DATA_COLLECTION = 'datas'

export const generatePipeline = (schema: Object, id: string, dataId?: string) => {
  const objectId = mongoose.Types.ObjectId
  let pipeline: any 
  if(dataId){
    pipeline = [{
      '$match': {
        '_id': new objectId(id)
      }
    }, {
      '$lookup': {
        'from': `${DATA_COLLECTION}`,
        'pipeline': [
          {
            '$match': {
              '_id': new objectId(dataId)
            }
          }
        ], 
        'as': 'data'
      }
    }, {
      '$unwind': {
        'path': '$data'
      }
    }]
  } else {
    pipeline = [{
      '$match': {
        '_id': new objectId(id)
      }
    }, {
      '$lookup': {
        'from': `${DATA_COLLECTION}`,
        'localField': 'currentVersion',
        'foreignField': '_id',
        'as': 'data'
      }
    }, {
      '$unwind': {
        'path': '$data'
      }
    }]
  }
  const references: ReferenceObject[] = Object.values(schema).filter((value: any) => {
    if (value instanceof Object) return isAnObjectReference(value)
  })

  if (references.length) {
    const keys = Object.keys(schema)
    const referenceKey = Object.keys(schema).filter(key => {
      return typeof schema[key] === 'object' && isAnObjectReference(schema[key])
    })
    pipeline.push({
      '$unwind': {
        'path': '$data.data'
      }
    })
    references.map((r, index) => {
      const key = referenceKey[index]
      pipeline.push({
        '$lookup': {
          'from': `${DATA_COLLECTION}`,
          'let': {
            'data_id': `$data.schema.${referenceKey[index]}.reference`,
            'local_key': `$data.data.${r.localKey}`,
            'obj': '$data.data'
          },
          'pipeline': [
            {
              '$match': {
                '$expr': {
                  '$eq': [
                    {
                      '$toString': '$_id'
                    }, '$$data_id'
                  ]
                }
              }
            }, {
              '$project': {
                [key]: {
                  '$first': {
                    '$filter': {
                      'input': '$data',
                      'as': 'item',
                      'cond': {
                        '$eq': [
                          `$$item.${r.referenceKey}`, '$$local_key'
                        ]
                      }
                    }
                  }
                },
                '_id': '$$obj._id',
                ...keys.reduce((acc, k) => {
                  if (k != referenceKey[index]) {
                    acc[k] = `$$obj.${k}`
                  }
                  return acc
                }, {})
              }
            }
          ],
          'as': 'data.data'
        }
      })
      pipeline.push({
        '$unwind': {
          'path': '$data.data'
        }
      })
    })
    pipeline.push({
      '$group': {
        '_id': '$_id',
        'name': {
          '$first': '$name'
        },
        'description': {
          '$first': '$description'
        },
        'creationDate': {
          '$first': '$creationDate'
        },
        'lastEditDate': {
          '$first': '$lastEditDate'
        },
        'versions': {
          '$first': '$versions'
        },
        'owner': {
          '$first': '$owner'
        },
        'editors': {
          '$first': '$editors'
        },
        'linkedDatasets': {
          '$first': '$linkedDatasets'
        },
        'currentVersion': {
          '$first': '$currentVersion'
        },
        'isDriveFile': {
          '$first': '$isDriveFile'
        },
        'driveFileId': {
          '$first': '$driveFileId'
        },
        'mimeType': {
          '$first': '$mimeType'
        },
        'data': {
          '$first': {
            '_id': '$data._id',
            'datasetId': '$data.datasetId',
            'date': '$data.date',
            'schema': '$data.schema'
          }
        },
        'datas': {
          '$push': '$data.data'
        }
      }
    }, {
      '$project': {
        'name': 1,
        'description': 1,
        'creationDate': 1,
        'lastEditDate': 1,
        'versions': 1,
        'owner': 1,
        'editors': 1,
        'linkedDatasets': 1,
        'currentVersion': 1,
        'isDriveFile': 1,
        'driveFileId': 1,
        'mimeType': 1,
        'data': {
          '_id': 1,
          'datasetId': 1,
          'date': 1,
          'schema': 1,
          'data': '$datas'
        }
      }
    })
  }
  return pipeline
}