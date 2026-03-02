import { PrismaClient, TrackType, Difficulty, PlatformSource } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding TLE CP Sheet...");

    // 1. Rating 800
    const rating800 = await prisma.topic.upsert({
        where: { slug: "rating-800" },
        update: {},
        create: {
            name: "Rating 800",
            slug: "rating-800",
            track: TrackType.CP,
            order: 1,
        }
    });

    const r800_sub1 = await prisma.subtopic.upsert({
        where: { topicId_slug: { topicId: rating800.id, slug: "rating-800-set-1" } },
        update: {},
        create: {
            name: "Set 1",
            slug: "rating-800-set-1",
            order: 1,
            topicId: rating800.id
        }
    });

    await prisma.problem.upsert({
        where: { slug: "watermelon" },
        update: {},
        create: {
            title: "Watermelon",
            slug: "watermelon",
            description: "One hot summer day Pete and his friend Billy decided to buy a watermelon...",
            constraints: "1 <= w <= 100",
            examples: [{ "input": "8", "output": "YES" }],
            difficulty: Difficulty.EASY,
            trackType: TrackType.CP,
            topicId: rating800.id,
            subtopicId: r800_sub1.id,
            platformSource: PlatformSource.CODEFORCES,
            platformUrl: "https://codeforces.com/problemset/problem/4/A",
            rating: 800,
            order: 1,
            isPublished: true,
        }
    });

    await prisma.problem.upsert({
        where: { slug: "way-too-long-words" },
        update: {},
        create: {
            title: "Way Too Long Words",
            slug: "way-too-long-words",
            description: "Sometimes some words like 'localization' or 'internationalization' are so long that writing them many times in one text is quite tiresome.",
            constraints: "1 <= n <= 100",
            examples: [{ "input": "4\\nword\\nlocalization\\ninternationalization\\npneumonoultramicroscopicsilicovolcanoconiosis", "output": "word\\nl10n\\ni18n\\np43s" }],
            difficulty: Difficulty.EASY,
            trackType: TrackType.CP,
            topicId: rating800.id,
            subtopicId: r800_sub1.id,
            platformSource: PlatformSource.CODEFORCES,
            platformUrl: "https://codeforces.com/problemset/problem/71/A",
            rating: 800,
            order: 2,
            isPublished: true,
        }
    });


    // 2. Rating 900
    const rating900 = await prisma.topic.upsert({
        where: { slug: "rating-900" },
        update: {},
        create: {
            name: "Rating 900",
            slug: "rating-900",
            track: TrackType.CP,
            order: 2,
        }
    });

    const r900_sub1 = await prisma.subtopic.upsert({
        where: { topicId_slug: { topicId: rating900.id, slug: "rating-900-set-1" } },
        update: {},
        create: {
            name: "Set 1",
            slug: "rating-900-set-1",
            order: 1,
            topicId: rating900.id
        }
    });

    await prisma.problem.upsert({
        where: { slug: "football" },
        update: {},
        create: {
            title: "Football",
            slug: "football",
            description: "Petya loves football very much. One day, as he was watching a football match, he was writing the players' current positions on a piece of paper...",
            constraints: "1 <= |s| <= 100",
            examples: [{ "input": "001001", "output": "NO" }, { "input": "1000000001", "output": "YES" }],
            difficulty: Difficulty.EASY,
            trackType: TrackType.CP,
            topicId: rating900.id,
            subtopicId: r900_sub1.id,
            platformSource: PlatformSource.CODEFORCES,
            platformUrl: "https://codeforces.com/problemset/problem/96/A",
            rating: 900,
            order: 1,
            isPublished: true,
        }
    });


    console.log("TLE CP Sheet seeding finished.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
