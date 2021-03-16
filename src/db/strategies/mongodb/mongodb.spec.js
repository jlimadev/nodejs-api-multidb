const Mongoose = require("mongoose");
const MongoDb = require("./mongodb");

jest.mock("mongoose");

const mongooseMock = () => {
  const STATES = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
    99: "uninitialized",
  };

  const mockFind = {
    sort: jest.fn(() => mockFind),
    skip: jest.fn(() => mockFind),
    limit: jest.fn(() => mockFind),
  };

  const mockedModelsFn = {
    create: jest.fn(),
    find: jest.fn(() => mockFind),
    updateOne: jest.fn(),
    deleteOne: jest.fn(),
    deleteMany: jest.fn(),
  };

  const mockedConnection = {
    model: { heroes: "any" },
    models: { heroes: "any" },
    Schema: jest.fn(),
    states: STATES,
  };

  Mongoose.connection = mockedConnection;
  Mongoose.connect = jest.fn().mockReturnValue(true);
  Mongoose.disconnect = jest.fn().mockReturnValue(true);

  return { mockFind, mockedModelsFn, mockedConnection };
};

const makeSut = () => {
  const { mockedModelsFn, mockedConnection, mockFind } = mongooseMock();
  const Sut = MongoDb;
  const connection = MongoDb.connect();
  const schema = mockedModelsFn;

  const errorMessage = "Any error";
  const mockUUID = "19cb7c30-da60-45e4-b6ea-0a1f889da84c";
  const mockInput = {
    name: "any name",
    power: "any power",
    createdAt: "2021-02-18T21:18:25.429Z",
    __v: 0,
  };
  const mockUpdate = { name: "any other name", power: "any other power" };
  const mockReturnValue = { _id: mockUUID, ...mockInput };

  const mockGenerateUuid = jest.fn().mockReturnValue(mockUUID);

  return {
    Sut,
    connection,
    schema,
    mockedModelsFn,
    mockFind,
    mockedConnection,
    errorMessage,
    mockUUID,
    mockInput,
    mockUpdate,
    mockReturnValue,
    mockGenerateUuid,
  };
};

describe("MongoDB", () => {
  describe("MongoDB exports and instances", () => {
    it("Should be instance of Object", () => {
      const { Sut, connection, schema, mockGenerateUuid } = makeSut();
      const mongodb = new Sut(connection, schema, mockGenerateUuid);

      expect(mongodb).toBeInstanceOf(Object);
    });

    it("Should export the functions", () => {
      const { Sut, connection, schema, mockGenerateUuid } = makeSut();
      const mongodb = new Sut(connection, schema, mockGenerateUuid);

      expect(mongodb.create).toBeInstanceOf(Function);
      expect(mongodb.read).toBeInstanceOf(Function);
      expect(mongodb.update).toBeInstanceOf(Function);
      expect(mongodb.delete).toBeInstanceOf(Function);
      expect(mongodb.isConnected).toBeInstanceOf(Function);
      expect(Sut.connect).toBeInstanceOf(Function);
      expect(Sut.disconnect).toBeInstanceOf(Function);
    });
  });

  describe("MongoDB Constructor", () => {
    it("Should throw an error if connection is not informed", () => {
      const { Sut, schema, mockGenerateUuid } = makeSut();

      const act = () => {
        new Sut(undefined, schema, mockGenerateUuid);
      };

      expect(act).toThrow("You must inject the dependecies");
    });

    it("Should throw an error if schema is not informed", () => {
      const { Sut, connection, mockGenerateUuid } = makeSut();

      const act = () => {
        new Sut(connection, undefined, mockGenerateUuid);
      };

      expect(act).toThrow("You must inject the dependecies");
    });

    it("Should throw an error if generateUuid is not informed", () => {
      const { Sut, connection, schema } = makeSut();

      const act = () => {
        new Sut(connection, schema, undefined);
      };

      expect(act).toThrow("You must inject the dependecies");
    });

    it("Should return an object containning the connection and the schema", () => {
      const { Sut, connection, schema, mockGenerateUuid } = makeSut();

      const mongodb = new Sut(connection, schema, mockGenerateUuid);
      const keys = Object.keys(mongodb);

      expect(mongodb).toBeInstanceOf(Object);
      expect(keys).toStrictEqual(["_connection", "_schema", "_generateUuid"]);
    });
  });

  describe("MongoDB Methods", () => {
    describe("CREATE TEST SUIT", () => {
      describe("Success cases", () => {
        it("Should CREATE the item on mongoDB", async () => {
          const {
            Sut,
            connection,
            schema,
            mockGenerateUuid,
            mockedModelsFn,
            mockInput,
            mockReturnValue,
          } = makeSut();
          const mongo = new Sut(connection, schema, mockGenerateUuid);

          mockedModelsFn.create = jest.fn().mockReturnValue(mockReturnValue);

          const result = await mongo.create(mockInput);

          await expect(result).toStrictEqual(mockReturnValue);
          expect(mockedModelsFn.create).toHaveBeenCalled();
        });
      });

      describe("Failure cases", () => {
        it("Should throw an error if call the method without the item", async () => {
          const {
            Sut,
            connection,
            schema,
            mockGenerateUuid,
            mockedModelsFn,
          } = makeSut();
          const mongo = new Sut(connection, schema, mockGenerateUuid);

          const act = async () => {
            await mongo.create();
          };

          expect(mockedModelsFn.create).not.toHaveBeenCalled();
          await expect(act).rejects.toThrow(
            "You must inform the item to be inserted"
          );
        });

        it("Should throw an error if mongo create rejects", async () => {
          const {
            Sut,
            connection,
            schema,
            mockGenerateUuid,
            mockedModelsFn,
            errorMessage,
            mockInput,
          } = makeSut();
          const mongo = new Sut(connection, schema, mockGenerateUuid);

          mockedModelsFn.create = jest.fn(() =>
            Promise.reject(new Error(errorMessage))
          );

          const act = async () => {
            await mongo.create(mockInput);
          };

          await expect(act).rejects.toThrow(errorMessage);
          expect(mockedModelsFn.create).toHaveBeenCalled();
        });
      });
    });

    describe("READ TEST SUIT", () => {
      describe("Success cases", () => {
        it("Should READ and return an array with the results", async () => {
          const {
            Sut,
            connection,
            schema,
            mockGenerateUuid,
            mockUUID,
            mockedModelsFn,
            mockFind,
            mockReturnValue,
          } = makeSut();
          const mongo = new Sut(connection, schema, mockGenerateUuid);
          const searchItem = { _id: mockUUID };

          mockFind.limit = jest.fn(() => mockReturnValue);

          const result = await mongo.read(searchItem);

          await expect(result).toBe(mockReturnValue);
          expect(mockedModelsFn.find).toHaveBeenCalled();
          expect(mockFind.skip).toHaveBeenCalledWith(0);
          expect(mockFind.limit).toHaveBeenCalledWith(10);
        });
      });

      describe("Failure cases", () => {
        it("Should return an error if read fails/throw", async () => {
          const {
            Sut,
            connection,
            schema,
            mockGenerateUuid,
            mockUUID,
            mockedModelsFn,
            mockFind,
            errorMessage,
          } = makeSut();
          const mongo = new Sut(connection, schema, mockGenerateUuid);
          const searchItem = { _id: mockUUID };

          mockFind.limit = jest.fn(() =>
            Promise.reject(new Error(errorMessage))
          );

          const act = async () => {
            await mongo.read(searchItem);
          };

          await expect(act).rejects.toThrow(errorMessage);
          expect(mockedModelsFn.find).toHaveBeenCalled();
          expect(mockFind.skip).toHaveBeenCalledWith(0);
          expect(mockFind.limit).toHaveBeenCalledWith(10);
        });
      });
    });

    describe("UPDATE TEST SUIT", () => {
      describe("Success cases", () => {
        it("Should UPDATE successfuly and result a summary of transaction", async () => {
          const {
            Sut,
            connection,
            schema,
            mockGenerateUuid,
            mockUUID,
            mockUpdate,
            mockedModelsFn,
          } = makeSut();
          const mongo = new Sut(connection, schema, mockGenerateUuid);
          const expectedResult = { n: 1, nModified: 1, ok: 1 };

          mockedModelsFn.updateOne = jest.fn().mockReturnValue(expectedResult);

          const result = await mongo.update(mockUUID, mockUpdate);

          expect(result).toBe(expectedResult);
          expect(mockedModelsFn.updateOne).toHaveBeenCalledWith(
            { _id: mockUUID },
            { $set: mockUpdate },
            {}
          );
        });

        it("Should not UPDATE if id does not exists and must show a summary of transaction", async () => {
          const {
            Sut,
            connection,
            schema,
            mockGenerateUuid,
            mockUUID,
            mockUpdate,
            mockedModelsFn,
          } = makeSut();
          const mongo = new Sut(connection, schema, mockGenerateUuid);
          const expectedResult = { n: 0, nModified: 0, ok: 1 };

          mockedModelsFn.updateOne = jest.fn().mockReturnValue(expectedResult);

          const result = await mongo.update(mockUUID, mockUpdate);

          expect(result).toBe(expectedResult);
          expect(mockedModelsFn.updateOne).toHaveBeenCalledWith(
            { _id: mockUUID },
            { $set: mockUpdate },
            {}
          );
        });

        it("Should UPSERT successfuly and result a summary of transaction", async () => {
          const {
            Sut,
            connection,
            schema,
            mockGenerateUuid,
            mockUpdate,
            mockedModelsFn,
            mockUUID,
          } = makeSut();
          const mongo = new Sut(connection, schema, mockGenerateUuid);
          const expectedResult = {
            n: 1,
            nModified: 0,
            upserted: [{ index: 0, _id: mockUUID }],
            ok: 1,
          };

          mockedModelsFn.updateOne = jest.fn().mockReturnValue(expectedResult);

          const result = await mongo.update(null, mockUpdate, true);

          expect(result).toBe(expectedResult);
          expect(mockGenerateUuid).toHaveBeenCalled();
          expect(mockedModelsFn.updateOne).toHaveBeenCalledWith(
            { _id: mockUUID },
            { $set: mockUpdate },
            {
              new: true,
              rawResult: true,
              setDefaultsOnInsert: true,
              upsert: true,
            }
          );
        });
      });

      describe("Failure cases", () => {
        it("Should throw an error if uuid is not sent", async () => {
          const {
            Sut,
            connection,
            schema,
            mockGenerateUuid,
            mockUpdate,
            mockedModelsFn,
          } = makeSut();
          const mongo = new Sut(connection, schema, mockGenerateUuid);

          const act = async () => {
            await mongo.update(undefined, mockUpdate);
          };

          await expect(act).rejects.toThrow(
            "You must inform the UUID to be updated"
          );
          expect(mockedModelsFn.updateOne).not.toHaveBeenCalled();
        });

        it("Should throw an error if item is not sent", async () => {
          const {
            Sut,
            connection,
            schema,
            mockGenerateUuid,
            mockUUID,
            mockedModelsFn,
          } = makeSut();
          const mongo = new Sut(connection, schema, mockGenerateUuid);

          const act = async () => {
            await mongo.update(mockUUID, undefined);
          };

          await expect(act).rejects.toThrow(
            "You must inform the item to be updated"
          );
          expect(mockedModelsFn.updateOne).not.toHaveBeenCalled();
        });

        it("Should fail if any error happens on updateOne from mongooose", async () => {
          const {
            Sut,
            connection,
            schema,
            mockGenerateUuid,
            errorMessage,
            mockUUID,
            mockUpdate,
            mockedModelsFn,
          } = makeSut();
          const mongo = new Sut(connection, schema, mockGenerateUuid);

          mockedModelsFn.updateOne = jest.fn(() =>
            Promise.reject(new Error(errorMessage))
          );

          const act = async () => {
            await mongo.update(mockUUID, mockUpdate);
          };

          await expect(act).rejects.toThrow(errorMessage);
          expect(mockedModelsFn.updateOne).toHaveBeenCalledWith(
            { _id: mockUUID },
            { $set: mockUpdate },
            {}
          );
        });
      });
    });

    describe("DELETE TEST SUIT", () => {
      describe("Success cases", () => {
        it("should DELETE based on id using deleteOne from mongoose", async () => {
          const {
            Sut,
            connection,
            schema,
            mockGenerateUuid,
            mockedModelsFn,
            mockUUID,
          } = makeSut();
          const mongo = new Sut(connection, schema, mockGenerateUuid);

          mockedModelsFn.deleteOne = jest
            .fn()
            .mockReturnValue({ n: 1, ok: 1, deletedCount: 1 });

          const result = await mongo.delete(mockUUID);

          expect(result).toStrictEqual({ n: 1, ok: 1, deletedCount: 1 });
          expect(mockedModelsFn.deleteOne).toHaveBeenCalledWith({
            _id: mockUUID,
          });
        });

        it("should DELETE all using deleteMany from mongoose", async () => {
          const {
            Sut,
            connection,
            schema,
            mockGenerateUuid,
            mockedModelsFn,
          } = makeSut();
          const mongo = new Sut(connection, schema, mockGenerateUuid);

          mockedModelsFn.deleteMany = jest
            .fn()
            .mockReturnValue({ n: 2, ok: 1, deletedCount: 2 });

          const result = await mongo.delete();

          expect(result).toStrictEqual({ n: 2, ok: 1, deletedCount: 2 });
          expect(mockedModelsFn.deleteMany).toHaveBeenCalledWith({});
        });
      });

      describe("Failure cases", () => {
        it("should return an error if deleteOne from mongoose fails", async () => {
          const {
            Sut,
            connection,
            schema,
            mockGenerateUuid,
            errorMessage,
            mockedModelsFn,
            mockUUID,
          } = makeSut();
          const mongo = new Sut(connection, schema, mockGenerateUuid);

          mockedModelsFn.deleteOne = jest.fn(() =>
            Promise.reject(new Error(errorMessage))
          );

          const act = async () => {
            await mongo.delete(mockUUID);
          };

          await expect(act).rejects.toThrow(errorMessage);
          expect(mockedModelsFn.deleteOne).toHaveBeenCalledWith({
            _id: mockUUID,
          });
        });

        it("should return an error if deleteMany from mongoose fails", async () => {
          const {
            Sut,
            connection,
            schema,
            mockGenerateUuid,
            errorMessage,
            mockedModelsFn,
          } = makeSut();
          const mongo = new Sut(connection, schema, mockGenerateUuid);

          mockedModelsFn.deleteMany = jest.fn(() =>
            Promise.reject(new Error(errorMessage))
          );

          const act = async () => {
            await mongo.delete();
          };

          await expect(act).rejects.toThrow(errorMessage);
          expect(mockedModelsFn.deleteMany).toHaveBeenCalledWith({});
        });
      });
    });
  });

  describe("MongoDB Static Methods", () => {
    describe("disconnect", () => {
      it("Should throw an error if fails on close connection", async () => {
        const { Sut, errorMessage } = makeSut();
        Mongoose.disconnect = jest.fn(() => {
          throw new Error(errorMessage);
        });

        const act = async () => {
          await Sut.disconnect();
        };

        expect(act()).rejects.toThrow(errorMessage);
        expect(Mongoose.disconnect).toHaveBeenCalled();
      });

      it("Should close the connection", async () => {
        const { Sut } = makeSut();

        const result = await Sut.disconnect();

        expect(result).toBe(true);
        expect(Mongoose.disconnect).toHaveBeenCalled();
      });
    });

    describe("connect", () => {
      it("Should throw an error if connect method fails", () => {
        const { Sut, errorMessage } = makeSut();

        Mongoose.connect = jest.fn(() => {
          throw new Error(errorMessage);
        });

        const act = () => {
          Sut.connect();
        };

        expect(act).toThrow(errorMessage);
        expect(Mongoose.connect).toHaveBeenCalled();
      });

      it("Should return the connection object", () => {
        const { Sut, mockedConnection } = makeSut();
        const result = Sut.connect();

        expect(result).toStrictEqual(mockedConnection);
      });
    });
  });
});
