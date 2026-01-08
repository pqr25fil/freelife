import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, createToken, setSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password, username, name } = await request.json();

    // Validate input
    if (!email || !password || !username || !name) {
      return NextResponse.json(
        { error: "Все поля обязательны" },
        { status: 400 }
      );
    }

    if (username.length < 3 || username.length > 20) {
      return NextResponse.json(
        { error: "Username должен быть от 3 до 20 символов" },
        { status: 400 }
      );
    }

    if (!/^[a-z0-9_]+$/.test(username)) {
      return NextResponse.json(
        { error: "Username может содержать только буквы, цифры и _" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Пароль должен быть минимум 6 символов" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return NextResponse.json(
        { error: "Email уже используется" },
        { status: 400 }
      );
    }

    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) {
      return NextResponse.json(
        { error: "Username уже занят" },
        { status: 400 }
      );
    }

    // Create user
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
        name,
      },
    });

    // Create session
    const token = await createToken(user.id);
    await setSession(token);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}
