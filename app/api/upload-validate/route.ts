import { NextResponse } from "next/server";
import { validateUploadSecurity } from "@/lib/security";

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json({ isValid: false, error: "No file was attached in the upload request." }, { status: 400 });
      }

      const buffer = await file.arrayBuffer();
      const result = await validateUploadSecurity(buffer, file.name);

      if (!result.isValid) {
        return NextResponse.json(result, { status: 422 });
      }

      return NextResponse.json(result);
    }

    const body = await req.json();
    const { fileName, fileContent } = body;

    if (!fileName || !fileContent) {
      return NextResponse.json({ isValid: false, error: "Missing required parameters: fileName and fileContent." }, { status: 400 });
    }

    const result = await validateUploadSecurity(fileContent, fileName);
    if (!result.isValid) {
      return NextResponse.json(result, { status: 422 });
    }

    return NextResponse.json(result);

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error during upload validation.";
    return NextResponse.json({ isValid: false, error: message }, { status: 500 });
  }
}
