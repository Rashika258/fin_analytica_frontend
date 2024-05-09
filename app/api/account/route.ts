import { NextRequest, NextResponse } from "next/server";
import { getUser } from "../lib/user";
import { error } from "console";
import { preferencesSchema } from "@/lib/validations/preferences";
import * as z from "zod";


export async function PUT(request: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json(
      {
        error: "Not Authenticated",
      },
      {
        status: 401,
      }
    );
  }

  const body = (await request.json()) as z.infer<typeof preferencesSchema>;

  try {
    const updatedPreferences = await prisma.preferences.update({
        where:{
            userId: user.id
        },
        data:{
            classificationModel: body.classificationModel,
            extractionModel: body.extractionModel,
            analysisModel: body.analysisModel,
            receiptExampleExtrationId: body.enableReceiptsOneShot
              ? body.receiptExampleExtractionId
              : null,
            invoiceExampleExtractionId: body.enableInvoicesOneShot
              ? body.invoiceExampleExtractionId
              : null,
            cardStatementExampleExtractionId: body.enableCardStatementsOneShot
              ? body.cardStatementExampleExtractionId
              : null,
        }
    });
    return NextResponse.json(
        {
            message:"Preferences Updated",
            id: updatedPreferences.id
        },
        {
            status: 200
        }
    )
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Preferences could not be updated" },
      { status: 500 }
    );
  }
}


export async function () {
    const user = await getUser();

    if(!user) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const extractions = await prisma.extraction.findMany({
        where:{
            userId: user.id
        }
    })

    
}