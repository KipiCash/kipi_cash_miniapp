// Code: API para eliminar un documento de la colección requests

import { NextRequest, NextResponse } from "next/server";
import { deleteRequest } from "@/db/request";

const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { requestId } = body;

    if (typeof requestId !== "string") {
      return NextResponse.json(
        { error: "El requestId debe ser un string" },
        { status: 400 }
      );
    };

    await deleteRequest(requestId);

    return NextResponse.json(
      { message: "Documento eliminado correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar el documento:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export { POST };