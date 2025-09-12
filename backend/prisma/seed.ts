import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function ensureAuthor(name: string, bio?: string) {
  const existing = await prisma.author.findFirst({ where: { name } });
  if (existing) return existing;
  return prisma.author.create({ data: { name, bio } });
}

async function ensureBook(
  title: string,
  authorId: string,
  opts: { description?: string; publishedYear?: number } = {}
) {
  const existing = await prisma.book.findFirst({ where: { title, authorId } });
  if (existing) return existing;
  return prisma.book.create({
    data: {
      title,
      authorId,
      description: opts.description,
      publishedYear: opts.publishedYear,
    },
  });
}

async function main() {
  const tolkien = await ensureAuthor(
    "J.R.R. Tolkien",
    "English writer and professor, best known for Middle-earth."
  );
  const rowling = await ensureAuthor("J.K. Rowling");
  const martin = await ensureAuthor(
    "George R. R. Martin",
    "Author of A Song of Ice and Fire."
  );
  const orwell = await ensureAuthor("George Orwell");

  await ensureBook("The Hobbit", tolkien.id, {
    description: "Bilbo's journey to the Lonely Mountain.",
    publishedYear: 1937,
  });
  await ensureBook("The Fellowship of the Ring", tolkien.id, {
    publishedYear: 1954,
  });
  await ensureBook("Harry Potter and the Philosopher's Stone", rowling.id, {
    publishedYear: 1997,
  });
  await ensureBook("A Game of Thrones", martin.id, { publishedYear: 1996 });
  await ensureBook("1984", orwell.id, {
    description: "Dystopian novel about surveillance and control.",
    publishedYear: 1949,
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });