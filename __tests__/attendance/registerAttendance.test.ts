const mockGetDoc = jest.fn();
const mockAddDoc = jest.fn();
const mockServerTimestamp = jest.fn(() => ({ toMillis: () => Date.now() }));

const registerAttendance = async (
  employeeId: string,
  userId: string | null,
) => {
  if (!userId) {
    throw new Error("ERR_AUTH_REQUIRED");
  }

  const employeeSnap = await mockGetDoc();

  if (!employeeSnap.exists()) {
    throw new Error("Empleado no encontrado.");
  }

  const employeeName = employeeSnap.data().name;

  await mockAddDoc({
    employeeId,
    employeeName,
    userId,
    timestamp: mockServerTimestamp(),
  });

  return { employeeName };
};

jest.mock("firebase/firestore", () => ({
  ...jest.requireActual("firebase/firestore"),
  getDoc: mockGetDoc,
  addDoc: mockAddDoc,
  serverTimestamp: mockServerTimestamp,
  collection: jest.fn(),
  doc: jest.fn(),
}));

const MOCK_EMPLOYEE_ID = "EMP001";
const MOCK_USER_ID = "UID_ADMIN_TEST";
const MOCK_EMPLOYEE_NAME = "Admin Test";

const MOCK_SNAPSHOT_EXISTS = {
  exists: () => true,
  data: () => ({ name: MOCK_EMPLOYEE_NAME }),
};

const MOCK_SNAPSHOT_NOT_EXISTS = {
  exists: () => false,
  data: () => ({}),
};

// =====================================================================
// PRUEBAS UNITARIAS: Use Case de Registro
// =====================================================================
describe("Use Case: Registrar Asistencia (registerAttendance)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetDoc.mockResolvedValue(MOCK_SNAPSHOT_EXISTS);
    mockAddDoc.mockResolvedValue({});
  });

  test("1. Debe registrar la asistencia y retornar el nombre del empleado", async () => {
    await expect(
      registerAttendance(MOCK_EMPLOYEE_ID, MOCK_USER_ID),
    ).resolves.toEqual({
      employeeName: MOCK_EMPLOYEE_NAME,
    });

    expect(mockGetDoc).toHaveBeenCalledTimes(1);
    expect(mockAddDoc).toHaveBeenCalledTimes(1);

    const dataPassed = mockAddDoc.mock.calls[0][0];

    expect(dataPassed).toEqual(
      expect.objectContaining({
        employeeId: MOCK_EMPLOYEE_ID,
        employeeName: MOCK_EMPLOYEE_NAME,
        userId: MOCK_USER_ID,
        timestamp: expect.any(Object),
      }),
    );
  });

  test("2. Debe lanzar un error si el empleado no es encontrado", async () => {
    mockGetDoc.mockResolvedValue(MOCK_SNAPSHOT_NOT_EXISTS);

    await expect(
      registerAttendance(MOCK_EMPLOYEE_ID, MOCK_USER_ID),
    ).rejects.toThrow("Empleado no encontrado.");

    expect(mockAddDoc).not.toHaveBeenCalled();
  });

  test("3. Debe propagar un error si la escritura (addDoc) falla", async () => {
    const firestoreError = new Error("Firestore write failed.");
    mockAddDoc.mockRejectedValue(firestoreError);

    await expect(
      registerAttendance(MOCK_EMPLOYEE_ID, MOCK_USER_ID),
    ).rejects.toThrow("Firestore write failed.");

    expect(mockGetDoc).toHaveBeenCalledTimes(1);
    expect(mockAddDoc).toHaveBeenCalledTimes(1);
  });

  test("4. Debe lanzar un error si el userId es nulo (sin autenticación)", async () => {
    await expect(registerAttendance(MOCK_EMPLOYEE_ID, null)).rejects.toThrow(
      "ERR_AUTH_REQUIRED",
    );

    expect(mockGetDoc).not.toHaveBeenCalled();
    expect(mockAddDoc).not.toHaveBeenCalled();
  });
});
