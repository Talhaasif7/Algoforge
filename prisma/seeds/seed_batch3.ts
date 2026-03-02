import { PrismaClient, Difficulty, PlatformSource, TrackType } from "@prisma/client";

const prisma = new PrismaClient();

interface ProblemData {
    title: string; slug: string; description: string; constraints: string;
    examples: { input: string; output: string; explanation?: string }[];
    difficulty: Difficulty; tags: string[]; trackType: TrackType;
    topicSlug: string; platformSource: PlatformSource;
    boilerplate: Record<string, string>;
    testCases: { input: string; expectedOutput: string; isHidden: boolean }[];
}

const PROBLEMS: ProblemData[] = [
    // ═══ MORE ARRAYS ═══
    {
        title: "Product of Array Except Self",
        slug: "product-of-array-except-self",
        description: "Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`.\n\nYou must write an algorithm that runs in O(n) time and without using the division operation.",
        constraints: "2 <= nums.length <= 10^5\n-30 <= nums[i] <= 30\nThe product of any prefix or suffix of nums fits in a 32-bit integer.",
        examples: [{ input: "nums = [1,2,3,4]", output: "[24,12,8,6]" }, { input: "nums = [-1,1,0,-3,3]", output: "[0,0,9,0,0]" }],
        difficulty: "MEDIUM", tags: ["Array", "Prefix Sum"], trackType: "DSA", topicSlug: "arrays", platformSource: "LEETCODE",
        boilerplate: { PYTHON: `class Solution:\n    def productExceptSelf(self, nums: list[int]) -> list[int]:\n        # Write your solution here\n        pass\n\nimport sys, json\nnums = json.loads(sys.stdin.read().strip())\nprint(json.dumps(Solution().productExceptSelf(nums)))` },
        testCases: [
            { input: "[1,2,3,4]", expectedOutput: "[24,12,8,6]", isHidden: false },
            { input: "[-1,1,0,-3,3]", expectedOutput: "[0,0,9,0,0]", isHidden: false },
            { input: "[1,1]", expectedOutput: "[1,1]", isHidden: true },
        ]
    },
    {
        title: "Rotate Array",
        slug: "rotate-array",
        description: "Given an integer array `nums`, rotate the array to the right by `k` steps, where `k` is non-negative.",
        constraints: "1 <= nums.length <= 10^5\n-2^31 <= nums[i] <= 2^31 - 1\n0 <= k <= 10^5",
        examples: [{ input: "nums = [1,2,3,4,5,6,7], k = 3", output: "[5,6,7,1,2,3,4]" }],
        difficulty: "MEDIUM", tags: ["Array", "Math"], trackType: "DSA", topicSlug: "arrays", platformSource: "LEETCODE",
        boilerplate: { PYTHON: `class Solution:\n    def rotate(self, nums: list[int], k: int) -> None:\n        pass\n\nimport sys, json\nlines = sys.stdin.read().strip().split("\\n")\nnums = json.loads(lines[0])\nk = int(lines[1])\nSolution().rotate(nums, k)\nprint(json.dumps(nums))` },
        testCases: [
            { input: "[1,2,3,4,5,6,7]\n3", expectedOutput: "[5,6,7,1,2,3,4]", isHidden: false },
            { input: "[-1,-100,3,99]\n2", expectedOutput: "[3,99,-1,-100]", isHidden: false },
        ]
    },
    // ═══ MORE STRINGS ═══
    {
        title: "Longest Palindromic Substring",
        slug: "longest-palindromic-substring",
        description: "Given a string `s`, return the longest palindromic substring in `s`.",
        constraints: "1 <= s.length <= 1000\ns consists of only digits and English letters.",
        examples: [{ input: 's = "babad"', output: '"bab"', explanation: '"aba" is also an acceptable answer.' }],
        difficulty: "MEDIUM", tags: ["String", "Dynamic Programming"], trackType: "DSA", topicSlug: "strings", platformSource: "LEETCODE",
        boilerplate: { PYTHON: `class Solution:\n    def longestPalindrome(self, s: str) -> str:\n        pass\n\nimport sys\nprint(Solution().longestPalindrome(sys.stdin.read().strip()))` },
        testCases: [
            { input: "babad", expectedOutput: "bab", isHidden: false },
            { input: "cbbd", expectedOutput: "bb", isHidden: false },
            { input: "a", expectedOutput: "a", isHidden: true },
        ]
    },
    // ═══ DP ═══
    {
        title: "Longest Common Subsequence",
        slug: "longest-common-subsequence",
        description: "Given two strings `text1` and `text2`, return the length of their longest common subsequence. If there is no common subsequence, return `0`.\n\nA subsequence is a sequence that can be derived from another sequence by deleting some or no elements without changing the order of the remaining elements.",
        constraints: "1 <= text1.length, text2.length <= 1000\ntext1 and text2 consist of only lowercase English characters.",
        examples: [{ input: 'text1 = "abcde", text2 = "ace"', output: "3", explanation: 'The LCS is "ace"' }],
        difficulty: "MEDIUM", tags: ["String", "Dynamic Programming"], trackType: "DSA", topicSlug: "dp", platformSource: "LEETCODE",
        boilerplate: { PYTHON: `class Solution:\n    def longestCommonSubsequence(self, text1: str, text2: str) -> int:\n        pass\n\nimport sys\nlines = sys.stdin.read().strip().split("\\n")\nprint(Solution().longestCommonSubsequence(lines[0], lines[1]))` },
        testCases: [
            { input: "abcde\nace", expectedOutput: "3", isHidden: false },
            { input: "abc\nabc", expectedOutput: "3", isHidden: false },
            { input: "abc\ndef", expectedOutput: "0", isHidden: true },
        ]
    },
    {
        title: "Coin Change",
        slug: "coin-change",
        description: "You are given an integer array `coins` representing coin denominations and an integer `amount` representing a total amount of money.\n\nReturn the fewest number of coins needed to make up that amount. If that amount cannot be made up by any combination of the coins, return `-1`.",
        constraints: "1 <= coins.length <= 12\n1 <= coins[i] <= 2^31 - 1\n0 <= amount <= 10^4",
        examples: [{ input: "coins = [1,5,11], amount = 11", output: "1" }, { input: "coins = [2], amount = 3", output: "-1" }],
        difficulty: "MEDIUM", tags: ["Array", "Dynamic Programming", "BFS"], trackType: "DSA", topicSlug: "dp", platformSource: "LEETCODE",
        boilerplate: { PYTHON: `class Solution:\n    def coinChange(self, coins: list[int], amount: int) -> int:\n        pass\n\nimport sys, json\nlines = sys.stdin.read().strip().split("\\n")\ncoins = json.loads(lines[0])\namount = int(lines[1])\nprint(Solution().coinChange(coins, amount))` },
        testCases: [
            { input: "[1,5,11]\n11", expectedOutput: "1", isHidden: false },
            { input: "[2]\n3", expectedOutput: "-1", isHidden: false },
            { input: "[1]\n0", expectedOutput: "0", isHidden: true },
            { input: "[1,2,5]\n11", expectedOutput: "3", isHidden: true },
        ]
    },
    // ═══ MORE GRAPHS ═══
    {
        title: "Course Schedule",
        slug: "course-schedule",
        description: "There are a total of `numCourses` courses labeled from `0` to `numCourses - 1`. You are given an array `prerequisites` where `prerequisites[i] = [ai, bi]` indicates that you must take course `bi` first to take course `ai`.\n\nReturn `true` if you can finish all courses. Otherwise, return `false`.",
        constraints: "1 <= numCourses <= 2000\n0 <= prerequisites.length <= 5000\nAll prerequisite pairs are unique.",
        examples: [{ input: "numCourses = 2, prerequisites = [[1,0]]", output: "true" }, { input: "numCourses = 2, prerequisites = [[1,0],[0,1]]", output: "false" }],
        difficulty: "MEDIUM", tags: ["Graph", "DFS", "BFS", "Topological Sort"], trackType: "DSA", topicSlug: "graphs", platformSource: "LEETCODE",
        boilerplate: { PYTHON: `class Solution:\n    def canFinish(self, numCourses: int, prerequisites: list[list[int]]) -> bool:\n        pass\n\nimport sys, json\nlines = sys.stdin.read().strip().split("\\n")\nn = int(lines[0])\nprereqs = json.loads(lines[1])\nprint(str(Solution().canFinish(n, prereqs)).lower())` },
        testCases: [
            { input: "2\n[[1,0]]", expectedOutput: "true", isHidden: false },
            { input: "2\n[[1,0],[0,1]]", expectedOutput: "false", isHidden: false },
        ]
    },
    // ═══ TWO POINTERS ═══
    {
        title: "3Sum",
        slug: "3sum",
        description: "Given an integer array `nums`, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.\n\nNotice that the solution set must not contain duplicate triplets.",
        constraints: "3 <= nums.length <= 3000\n-10^5 <= nums[i] <= 10^5",
        examples: [{ input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]" }],
        difficulty: "MEDIUM", tags: ["Array", "Two Pointers", "Sorting"], trackType: "DSA", topicSlug: "two-pointers", platformSource: "LEETCODE",
        boilerplate: { PYTHON: `class Solution:\n    def threeSum(self, nums: list[int]) -> list[list[int]]:\n        pass\n\nimport sys, json\nnums = json.loads(sys.stdin.read().strip())\nresult = Solution().threeSum(nums)\nresult.sort()\nprint(json.dumps(result))` },
        testCases: [
            { input: "[-1,0,1,2,-1,-4]", expectedOutput: "[[-1,-1,2],[-1,0,1]]", isHidden: false },
            { input: "[0,1,1]", expectedOutput: "[]", isHidden: false },
            { input: "[0,0,0]", expectedOutput: "[[0,0,0]]", isHidden: true },
        ]
    },
    // ═══ MORE CP ═══
    {
        title: "Beautiful Matrix",
        slug: "cf-263a-beautiful-matrix",
        description: "You've got a 5 × 5 matrix, consisting of 24 zeros and a single one. Let's index the rows and columns from 1 to 5. You can perform the following operation: swap two neighboring rows. Find the minimum number of moves to move the 1 to the center cell (3, 3).",
        constraints: "The matrix is 5 × 5 with exactly one 1.",
        examples: [{ input: "0 0 0 0 0\n0 0 0 0 1\n0 0 0 0 0\n0 0 0 0 0\n0 0 0 0 0", output: "3" }],
        difficulty: "EASY", tags: ["Implementation"], trackType: "CP", topicSlug: "rating-800", platformSource: "CODEFORCES",
        boilerplate: { PYTHON: `# Read the 5x5 matrix and find minimum moves to center\nfor i in range(5):\n    row = list(map(int, input().split()))\n    # find the 1 and calculate moves\n` },
        testCases: [
            { input: "0 0 0 0 0\n0 0 0 0 1\n0 0 0 0 0\n0 0 0 0 0\n0 0 0 0 0", expectedOutput: "3", isHidden: false },
            { input: "0 0 0 0 0\n0 0 0 0 0\n0 0 1 0 0\n0 0 0 0 0\n0 0 0 0 0", expectedOutput: "0", isHidden: true },
        ]
    },
    {
        title: "Anton and Danik",
        slug: "cf-734a-anton-and-danik",
        description: "Anton and Danik play `n` games. In each game, someone wins. Find who wins more games. Output 'Anton', 'Danik', or 'Friendship' if tied.",
        constraints: "1 <= n <= 100000",
        examples: [{ input: "6\nADAAAA", output: "Anton" }, { input: "2\nAD", output: "Friendship" }],
        difficulty: "EASY", tags: ["Strings", "Implementation"], trackType: "CP", topicSlug: "rating-800", platformSource: "CODEFORCES",
        boilerplate: { PYTHON: `n = int(input())\ns = input()\n# Count 'A' and 'D', compare\n` },
        testCases: [
            { input: "6\nADAAAA", expectedOutput: "Anton", isHidden: false },
            { input: "7\nDDDAAAD", expectedOutput: "Danik", isHidden: false },
            { input: "2\nAD", expectedOutput: "Friendship", isHidden: true },
        ]
    },
    {
        title: "Stones on the Table",
        slug: "cf-266a-stones-on-table",
        description: "There are `n` colored stones in a row. Each stone is 'R' (red), 'G' (green), or 'B' (blue). Find the minimum number of stones to remove so that no two consecutive stones have the same color.",
        constraints: "1 <= n <= 50",
        examples: [{ input: "3\nRRG", output: "1" }, { input: "5\nRRRRR", output: "4" }],
        difficulty: "EASY", tags: ["Greedy", "Implementation"], trackType: "CP", topicSlug: "rating-800", platformSource: "CODEFORCES",
        boilerplate: { PYTHON: `n = int(input())\ns = input()\n# Count consecutive duplicates\n` },
        testCases: [
            { input: "3\nRRG", expectedOutput: "1", isHidden: false },
            { input: "5\nRRRRR", expectedOutput: "4", isHidden: false },
            { input: "4\nBRBG", expectedOutput: "0", isHidden: true },
        ]
    },
];

async function main() {
    console.log("🌱 Seeding batch 3...\n");
    let created = 0;

    for (const p of PROBLEMS) {
        const existing = await prisma.problem.findUnique({ where: { slug: p.slug } });
        if (existing) { console.log(`  ⏭  "${p.title}" exists`); continue; }

        const topic = await prisma.topic.findUnique({ where: { slug: p.topicSlug } });

        const problem = await prisma.problem.create({
            data: {
                title: p.title, slug: p.slug, description: p.description,
                constraints: p.constraints, examples: p.examples,
                difficulty: p.difficulty, tags: p.tags, trackType: p.trackType,
                topicId: topic?.id || null,
                platformSource: p.platformSource,
                boilerplate: p.boilerplate, isPublished: true, order: created + 33,
            }
        });

        for (let i = 0; i < p.testCases.length; i++) {
            await prisma.testCase.create({
                data: {
                    problemId: problem.id, input: p.testCases[i].input,
                    expectedOutput: p.testCases[i].expectedOutput,
                    isHidden: p.testCases[i].isHidden, isExample: !p.testCases[i].isHidden, order: i,
                }
            });
        }
        console.log(`  ✅ "${p.title}" (${p.difficulty})`);
        created++;
    }

    const total = await prisma.problem.count({ where: { isPublished: true } });
    console.log(`\n🎉 Created ${created} new. Total: ${total} problems.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
