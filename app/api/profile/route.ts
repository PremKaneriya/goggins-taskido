import { getFullNameById } from "@/lib/db/database";
import { getUserFromRequest } from "@/utils/session";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
    const userId = await getUserFromRequest(request);

    const username = await getFullNameById(userId);

    console.log(username);
    
    if (!username) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({ username });
};