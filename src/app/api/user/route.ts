import { NextResponse } from "next/server";
import { db } from "../../../../prisma";
import { hash } from "bcrypt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;
    console.log(await hash(password, 10), 'dsada');

    const user = await db.user.findUnique({ where: { email } });

    if (user) {
      return NextResponse.json(
        {
          message: "User with this email already exists",
        },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 10);
    const { password: passHash, ...newUser } = await db.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      user: newUser,
      message: "User created Successfully",
    });
  } catch (err) {
    return NextResponse.json(err, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (id) {
      const user = await db.user.delete({ where: { id } });
      if (user) {
        return NextResponse.json(
          { message: "User deleted successfully" },
          { status: 200 }
        );
      }
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Bad Request",
      },
      { status: 401 }
    );
  } catch (err) {
    return NextResponse.json(err, { status: 400 });
  }
}
