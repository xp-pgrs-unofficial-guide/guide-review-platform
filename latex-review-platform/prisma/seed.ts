import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a test chapter
  const chapter = await prisma.chapter.create({
    data: {
      title: '测试章节',
    },
  });

  console.log('Created test chapter:', chapter);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
