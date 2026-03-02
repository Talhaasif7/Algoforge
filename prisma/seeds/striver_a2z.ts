import { PrismaClient, TrackType, Difficulty, PlatformSource } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding Striver's A2Z DSA Sheet...");

    // 1. Array Basics
    const step1 = await prisma.topic.upsert({
        where: { slug: "step-1-basics" },
        update: {},
        create: {
            name: "Step 1 : Learn the basics",
            slug: "step-1-basics",
            track: TrackType.DSA,
            order: 1,
        }
    });

    const step1_1 = await prisma.subtopic.upsert({
        where: { topicId_slug: { topicId: step1.id, slug: "step-1-1-things-to-know" } },
        update: {},
        create: {
            name: "Lec 1: Things to Know in C++/Java/Python or any language",
            slug: "step-1-1-things-to-know",
            order: 1,
            topicId: step1.id
        }
    });

    await prisma.problem.upsert({
        where: { slug: "user-input-output" },
        update: {},
        create: {
            title: "User Input / Output",
            slug: "user-input-output",
            description: "Write a program that takes an input and prints it.",
            constraints: "N/A",
            examples: [],
            difficulty: Difficulty.EASY,
            trackType: TrackType.DSA,
            topicId: step1.id,
            subtopicId: step1_1.id,
            platformSource: PlatformSource.CUSTOM,
            order: 1,
            isPublished: true,
        }
    });

    // 2. Arrays
    const step3 = await prisma.topic.upsert({
        where: { slug: "step-3-arrays" },
        update: {},
        create: {
            name: "Step 3 : Solve Problems on Arrays",
            slug: "step-3-arrays",
            track: TrackType.DSA,
            order: 3,
        }
    });

    const step3_1 = await prisma.subtopic.upsert({
        where: { topicId_slug: { topicId: step3.id, slug: "step-3-1-easy" } },
        update: {},
        create: {
            name: "Lec 1: Easy",
            slug: "step-3-1-easy",
            order: 1,
            topicId: step3.id
        }
    });

    await prisma.problem.upsert({
        where: { slug: "two-sum" },
        update: {},
        create: {
            title: "Two Sum",
            slug: "two-sum",
            description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
            constraints: "2 <= nums.length <= 10^4",
            examples: [{ "input": "nums = [2,7,11,15], target = 9", "output": "[0,1]" }],
            difficulty: Difficulty.EASY,
            trackType: TrackType.DSA,
            topicId: step3.id,
            subtopicId: step3_1.id,
            platformSource: PlatformSource.LEETCODE,
            platformUrl: "https://leetcode.com/problems/two-sum/",
            order: 1,
            isPublished: true,
        }
    });

    await prisma.problem.upsert({
        where: { slug: "remove-duplicates-from-sorted-array" },
        update: {},
        create: {
            title: "Remove Duplicates from Sorted Array",
            slug: "remove-duplicates-from-sorted-array",
            description: "Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. The relative order of the elements should be kept the same.",
            constraints: "1 <= nums.length <= 3 * 10^4",
            examples: [{ "input": "nums = [1,1,2]", "output": "2, nums = [1,2,_]" }],
            difficulty: Difficulty.EASY,
            trackType: TrackType.DSA,
            topicId: step3.id,
            subtopicId: step3_1.id,
            platformSource: PlatformSource.LEETCODE,
            platformUrl: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/",
            order: 2,
            isPublished: true,
        }
    });

    const step3_2 = await prisma.subtopic.upsert({
        where: { topicId_slug: { topicId: step3.id, slug: "step-3-2-medium" } },
        update: {},
        create: {
            name: "Lec 2: Medium",
            slug: "step-3-2-medium",
            order: 2,
            topicId: step3.id
        }
    });

    await prisma.problem.upsert({
        where: { slug: "sort-colors" },
        update: {},
        create: {
            title: "Sort Colors",
            slug: "sort-colors",
            description: "Given an array nums with n objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the order red, white, and blue.",
            constraints: "n == nums.length",
            examples: [{ "input": "nums = [2,0,2,1,1,0]", "output": "[0,0,1,1,2,2]" }],
            difficulty: Difficulty.MEDIUM,
            trackType: TrackType.DSA,
            topicId: step3.id,
            subtopicId: step3_2.id,
            platformSource: PlatformSource.LEETCODE,
            platformUrl: "https://leetcode.com/problems/sort-colors/",
            order: 1,
            isPublished: true,
        }
    });

    console.log("Striver A2Z seeding finished.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
