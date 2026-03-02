import { PrismaClient, Difficulty, PlatformSource, TrackType } from "@prisma/client";

const prisma = new PrismaClient();

interface ProblemData {
    title: string;
    slug: string;
    description: string;
    constraints: string;
    examples: { input: string; output: string; explanation?: string }[];
    difficulty: Difficulty;
    tags: string[];
    trackType: TrackType;
    topicSlug: string;
    platformSource: PlatformSource;
    platformUrl?: string;
    timeComplexity?: string;
    boilerplate: Record<string, string>;
    testCases: { input: string; expectedOutput: string; isHidden: boolean }[];
}

const MORE_PROBLEMS: ProblemData[] = [
    // ═══ SORTING ═══
    {
        title: "Merge Sorted Array",
        slug: "merge-sorted-array",
        description: "You are given two integer arrays `nums1` and `nums2`, sorted in non-decreasing order, and two integers `m` and `n`, representing the number of elements in `nums1` and `nums2` respectively.\n\nMerge `nums2` into `nums1` as one sorted array. The final sorted array should be stored inside the array `nums1`.",
        constraints: "nums1.length == m + n\nnums2.length == n\n0 <= m, n <= 200",
        examples: [
            { input: "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3", output: "[1,2,2,3,5,6]" },
        ],
        difficulty: "EASY",
        tags: ["Array", "Two Pointers", "Sorting"],
        trackType: "DSA",
        topicSlug: "sorting",
        platformSource: "LEETCODE",
        timeComplexity: "m+n",
        boilerplate: {
            PYTHON: `class Solution:
    def merge(self, nums1: list[int], m: int, nums2: list[int], n: int) -> None:
        # Modify nums1 in-place
        pass

import sys, json
lines = sys.stdin.read().strip().split("\\n")
nums1 = json.loads(lines[0])
m = int(lines[1])
nums2 = json.loads(lines[2])
n = int(lines[3])
Solution().merge(nums1, m, nums2, n)
print(json.dumps(nums1))`,
        },
        testCases: [
            { input: "[1,2,3,0,0,0]\n3\n[2,5,6]\n3", expectedOutput: "[1,2,2,3,5,6]", isHidden: false },
            { input: "[1]\n1\n[]\n0", expectedOutput: "[1]", isHidden: false },
            { input: "[0]\n0\n[1]\n1", expectedOutput: "[1]", isHidden: true },
        ]
    },
    // ═══ RECURSION ═══
    {
        title: "Pow(x, n)",
        slug: "powx-n",
        description: "Implement `pow(x, n)`, which calculates `x` raised to the power `n` (i.e., `x^n`).",
        constraints: "-100.0 < x < 100.0\n-2^31 <= n <= 2^31-1\nEither x is not zero or n > 0.",
        examples: [
            { input: "x = 2.00000, n = 10", output: "1024.00000" },
            { input: "x = 2.10000, n = 3", output: "9.26100" },
        ],
        difficulty: "MEDIUM",
        tags: ["Math", "Recursion"],
        trackType: "DSA",
        topicSlug: "recursion",
        platformSource: "LEETCODE",
        timeComplexity: "log n",
        boilerplate: {
            PYTHON: `class Solution:
    def myPow(self, x: float, n: int) -> float:
        # Write your solution here
        pass

import sys
lines = sys.stdin.read().strip().split("\\n")
x = float(lines[0])
n = int(lines[1])
result = Solution().myPow(x, n)
print(f"{result:.5f}")`,
        },
        testCases: [
            { input: "2.00000\n10", expectedOutput: "1024.00000", isHidden: false },
            { input: "2.10000\n3", expectedOutput: "9.26100", isHidden: false },
            { input: "2.00000\n-2", expectedOutput: "0.25000", isHidden: true },
        ]
    },
    // ═══ SEARCHING ═══
    {
        title: "Search in Rotated Sorted Array",
        slug: "search-in-rotated-sorted-array",
        description: "There is an integer array `nums` sorted in ascending order (with distinct values). Prior to being passed to your function, `nums` is possibly rotated at an unknown pivot index.\n\nGiven the array `nums` after the possible rotation and an integer `target`, return the index of `target` if it is in `nums`, or `-1` if it is not in `nums`.\n\nYou must write an algorithm with O(log n) runtime complexity.",
        constraints: "1 <= nums.length <= 5000\n-10^4 <= nums[i] <= 10^4\nAll values of nums are unique.",
        examples: [
            { input: "nums = [4,5,6,7,0,1,2], target = 0", output: "4" },
            { input: "nums = [4,5,6,7,0,1,2], target = 3", output: "-1" },
        ],
        difficulty: "MEDIUM",
        tags: ["Array", "Binary Search"],
        trackType: "DSA",
        topicSlug: "searching",
        platformSource: "LEETCODE",
        timeComplexity: "log n",
        boilerplate: {
            PYTHON: `class Solution:
    def search(self, nums: list[int], target: int) -> int:
        # Write your solution here
        pass

import sys, json
lines = sys.stdin.read().strip().split("\\n")
nums = json.loads(lines[0])
target = int(lines[1])
print(Solution().search(nums, target))`,
        },
        testCases: [
            { input: "[4,5,6,7,0,1,2]\n0", expectedOutput: "4", isHidden: false },
            { input: "[4,5,6,7,0,1,2]\n3", expectedOutput: "-1", isHidden: false },
            { input: "[1]\n0", expectedOutput: "-1", isHidden: true },
        ]
    },
    // ═══ BST ═══
    {
        title: "Validate Binary Search Tree",
        slug: "validate-binary-search-tree",
        description: "Given the root of a binary tree, determine if it is a valid binary search tree (BST).\n\nA valid BST is defined as follows:\n- The left subtree of a node contains only nodes with keys less than the node's key.\n- The right subtree of a node contains only nodes with keys greater than the node's key.\n- Both the left and right subtrees must also be binary search trees.\n\nInput is given as level-order traversal.",
        constraints: "1 <= Number of nodes <= 10^4\n-2^31 <= Node.val <= 2^31 - 1",
        examples: [
            { input: "2 1 3", output: "true" },
            { input: "5 1 4 null null 3 6", output: "false" },
        ],
        difficulty: "MEDIUM",
        tags: ["Tree", "DFS", "BST", "Binary Tree"],
        trackType: "DSA",
        topicSlug: "bst",
        platformSource: "LEETCODE",
        timeComplexity: "n",
        boilerplate: {
            PYTHON: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def isValidBST(self, root: TreeNode) -> bool:
        # Write your solution here
        pass

import sys
data = sys.stdin.read().split()
nodes = [TreeNode(int(v)) if v != 'null' else None for v in data]
for i in range(len(nodes)):
    if nodes[i]:
        l, r = 2*i+1, 2*i+2
        if l < len(nodes): nodes[i].left = nodes[l]
        if r < len(nodes): nodes[i].right = nodes[r]
print(str(Solution().isValidBST(nodes[0])).lower())`,
        },
        testCases: [
            { input: "2 1 3", expectedOutput: "true", isHidden: false },
            { input: "5 1 4 null null 3 6", expectedOutput: "false", isHidden: false },
        ]
    },
    // ═══ HEAPS ═══
    {
        title: "Kth Largest Element in an Array",
        slug: "kth-largest-element-in-an-array",
        description: "Given an integer array `nums` and an integer `k`, return the `k`th largest element in the array.\n\nNote that it is the kth largest element in the sorted order, not the kth distinct element.",
        constraints: "1 <= k <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4",
        examples: [
            { input: "nums = [3,2,1,5,6,4], k = 2", output: "5" },
            { input: "nums = [3,2,3,1,2,4,5,5,6], k = 4", output: "4" },
        ],
        difficulty: "MEDIUM",
        tags: ["Array", "Heap", "Divide and Conquer", "Sorting"],
        trackType: "DSA",
        topicSlug: "heaps",
        platformSource: "LEETCODE",
        timeComplexity: "n log k",
        boilerplate: {
            PYTHON: `class Solution:
    def findKthLargest(self, nums: list[int], k: int) -> int:
        # Write your solution here
        pass

import sys, json
lines = sys.stdin.read().strip().split("\\n")
nums = json.loads(lines[0])
k = int(lines[1])
print(Solution().findKthLargest(nums, k))`,
        },
        testCases: [
            { input: "[3,2,1,5,6,4]\n2", expectedOutput: "5", isHidden: false },
            { input: "[3,2,3,1,2,4,5,5,6]\n4", expectedOutput: "4", isHidden: false },
        ]
    },
    // ═══ SLIDING WINDOW ═══
    {
        title: "Minimum Window Substring",
        slug: "minimum-window-substring",
        description: "Given two strings `s` and `t` of lengths `m` and `n` respectively, return the minimum window substring of `s` such that every character in `t` (including duplicates) is included in the window. If there is no such substring, return the empty string `\"\"`.",
        constraints: "m == s.length\nn == t.length\n1 <= m, n <= 10^5\ns and t consist of uppercase and lowercase English letters.",
        examples: [
            { input: 's = "ADOBECODEBANC", t = "ABC"', output: '"BANC"' },
            { input: 's = "a", t = "a"', output: '"a"' },
        ],
        difficulty: "HARD",
        tags: ["Hash Table", "String", "Sliding Window"],
        trackType: "DSA",
        topicSlug: "sliding-window",
        platformSource: "LEETCODE",
        timeComplexity: "m+n",
        boilerplate: {
            PYTHON: `class Solution:
    def minWindow(self, s: str, t: str) -> str:
        # Write your solution here
        pass

import sys
lines = sys.stdin.read().strip().split("\\n")
print(Solution().minWindow(lines[0], lines[1]))`,
        },
        testCases: [
            { input: "ADOBECODEBANC\nABC", expectedOutput: "BANC", isHidden: false },
            { input: "a\na", expectedOutput: "a", isHidden: false },
            { input: "a\naa", expectedOutput: "", isHidden: true },
        ]
    },
    // ═══ BACKTRACKING ═══
    {
        title: "Subsets",
        slug: "subsets",
        description: "Given an integer array `nums` of unique elements, return all possible subsets (the power set).\n\nThe solution set must not contain duplicate subsets. Return the subsets in any order.",
        constraints: "1 <= nums.length <= 10\n-10 <= nums[i] <= 10\nAll the numbers of nums are unique.",
        examples: [
            { input: "nums = [1,2,3]", output: "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]" },
        ],
        difficulty: "MEDIUM",
        tags: ["Array", "Backtracking", "Bit Manipulation"],
        trackType: "DSA",
        topicSlug: "backtracking",
        platformSource: "LEETCODE",
        timeComplexity: "n * 2^n",
        boilerplate: {
            PYTHON: `class Solution:
    def subsets(self, nums: list[int]) -> list[list[int]]:
        # Write your solution here
        pass

import sys, json
nums = json.loads(sys.stdin.read().strip())
result = Solution().subsets(nums)
result.sort(key=lambda x: (len(x), x))
print(json.dumps(result))`,
        },
        testCases: [
            { input: "[1,2,3]", expectedOutput: "[[],[1],[1,2],[1,2,3],[1,3],[2],[2,3],[3]]", isHidden: false },
            { input: "[0]", expectedOutput: "[[],[0]]", isHidden: false },
        ]
    },
    // ═══ TRIES ═══
    {
        title: "Implement Trie (Prefix Tree)",
        slug: "implement-trie-prefix-tree",
        description: "A trie (pronounced as \"try\") or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings.\n\nImplement the Trie class:\n- `Trie()` Initializes the trie object.\n- `void insert(String word)` Inserts the string `word` into the trie.\n- `boolean search(String word)` Returns `true` if the string `word` is in the trie, and `false` otherwise.\n- `boolean startsWith(String prefix)` Returns `true` if there is a previously inserted string that has the prefix `prefix`, and `false` otherwise.",
        constraints: "1 <= word.length, prefix.length <= 2000\nword and prefix consist only of lowercase English letters.",
        examples: [
            { input: "[\"Trie\",\"insert\",\"search\",\"search\",\"startsWith\",\"insert\",\"search\"]\n[[],[\"apple\"],[\"apple\"],[\"app\"],[\"app\"],[\"app\"],[\"app\"]]", output: "[null,null,true,false,true,null,true]" },
        ],
        difficulty: "MEDIUM",
        tags: ["Hash Table", "String", "Trie", "Design"],
        trackType: "DSA",
        topicSlug: "tries",
        platformSource: "LEETCODE",
        timeComplexity: "m (per operation)",
        boilerplate: {
            PYTHON: `class Trie:
    def __init__(self):
        # Initialize your data structure here
        pass

    def insert(self, word: str) -> None:
        pass

    def search(self, word: str) -> bool:
        pass

    def startsWith(self, prefix: str) -> bool:
        pass

import sys, json
lines = sys.stdin.read().strip().split("\\n")
ops = json.loads(lines[0])
args = json.loads(lines[1])
result = [None]
trie = Trie()
for i in range(1, len(ops)):
    r = getattr(trie, ops[i])(*args[i])
    result.append(r)
print(json.dumps(result))`,
        },
        testCases: [
            { input: '[\"Trie\",\"insert\",\"search\",\"search\",\"startsWith\",\"insert\",\"search\"]\n[[],[\"apple\"],[\"apple\"],[\"app\"],[\"app\"],[\"app\"],[\"app\"]]', expectedOutput: "[null,null,true,false,true,null,true]", isHidden: false },
        ]
    },
    // ═══ BIT MANIPULATION ═══
    {
        title: "Single Number",
        slug: "single-number",
        description: "Given a non-empty array of integers `nums`, every element appears twice except for one. Find that single one.\n\nYou must implement a solution with a linear runtime complexity and use only constant extra space.",
        constraints: "1 <= nums.length <= 3 * 10^4\n-3 * 10^4 <= nums[i] <= 3 * 10^4\nEach element appears twice except for one.",
        examples: [
            { input: "nums = [2,2,1]", output: "1" },
            { input: "nums = [4,1,2,1,2]", output: "4" },
        ],
        difficulty: "EASY",
        tags: ["Array", "Bit Manipulation"],
        trackType: "DSA",
        topicSlug: "bit-manipulation",
        platformSource: "LEETCODE",
        timeComplexity: "n",
        boilerplate: {
            PYTHON: `class Solution:
    def singleNumber(self, nums: list[int]) -> int:
        # Write your solution here
        pass

import sys, json
nums = json.loads(sys.stdin.read().strip())
print(Solution().singleNumber(nums))`,
        },
        testCases: [
            { input: "[2,2,1]", expectedOutput: "1", isHidden: false },
            { input: "[4,1,2,1,2]", expectedOutput: "4", isHidden: false },
            { input: "[1]", expectedOutput: "1", isHidden: true },
        ]
    },
    // ═══ QUEUE ═══
    {
        title: "Implement Queue using Stacks",
        slug: "implement-queue-using-stacks",
        description: "Implement a first in first out (FIFO) queue using only two stacks.\n\nImplement the `MyQueue` class:\n- `void push(int x)` Pushes element x to the back of the queue.\n- `int pop()` Removes the element from the front of the queue and returns it.\n- `int peek()` Returns the element at the front of the queue.\n- `boolean empty()` Returns `true` if the queue is empty, `false` otherwise.",
        constraints: "1 <= x <= 9\nAt most 100 calls will be made to push, pop, peek, and empty.\nAll the calls to pop and peek are valid.",
        examples: [
            { input: '[\"MyQueue\",\"push\",\"push\",\"peek\",\"pop\",\"empty\"]\n[[],[1],[2],[],[],[]]', output: "[null,null,null,1,1,false]" },
        ],
        difficulty: "EASY",
        tags: ["Stack", "Queue", "Design"],
        trackType: "DSA",
        topicSlug: "stacks-queues",
        platformSource: "LEETCODE",
        timeComplexity: "1 amortized",
        boilerplate: {
            PYTHON: `class MyQueue:
    def __init__(self):
        pass
    def push(self, x: int) -> None:
        pass
    def pop(self) -> int:
        pass
    def peek(self) -> int:
        pass
    def empty(self) -> bool:
        pass

import sys, json
lines = sys.stdin.read().strip().split("\\n")
ops = json.loads(lines[0])
args = json.loads(lines[1])
result = [None]
q = MyQueue()
for i in range(1, len(ops)):
    r = getattr(q, ops[i])(*args[i])
    result.append(r)
print(json.dumps(result))`,
        },
        testCases: [
            { input: '["MyQueue","push","push","peek","pop","empty"]\n[[],[1],[2],[],[],[]]', expectedOutput: "[null,null,null,1,1,false]", isHidden: false },
        ]
    },
    // ═══ MORE CP ═══
    {
        title: "Team",
        slug: "cf-231a-team",
        description: "One day three friends Petya, Vasya and Tonya decided to solve problems. They decided that if at least two of them are sure about the solution, they would write the solution, otherwise they would skip the problem.\n\nGiven `n` problems and for each problem, three binary values indicating whether each friend is sure about the solution, determine how many problems will they solve.",
        constraints: "1 <= n <= 1000",
        examples: [
            { input: "3\n1 1 0\n1 1 1\n1 0 0", output: "2" },
        ],
        difficulty: "EASY",
        tags: ["Greedy", "Implementation"],
        trackType: "CP",
        topicSlug: "rating-800",
        platformSource: "CODEFORCES",
        platformUrl: "https://codeforces.com/problemset/problem/231/A",
        boilerplate: {
            PYTHON: `n = int(input())
count = 0
for _ in range(n):
    a, b, c = map(int, input().split())
    # If at least 2 are sure, increment count
print(count)`,
        },
        testCases: [
            { input: "3\n1 1 0\n1 1 1\n1 0 0", expectedOutput: "2", isHidden: false },
            { input: "1\n0 0 0", expectedOutput: "0", isHidden: true },
        ]
    },
    {
        title: "Next Round",
        slug: "cf-158a-next-round",
        description: "Codeforces rounds are scored. `n` participants finished the round, and `k`-th place participant scored some points. Find how many participants will advance to the next round — those who scored strictly positive and no less than the `k`-th place participant.",
        constraints: "1 <= n <= 50\n1 <= k <= n",
        examples: [
            { input: "8 5\n10 9 8 7 7 7 5 5", output: "6" },
            { input: "5 2\n0 0 0 0 0", output: "0" },
        ],
        difficulty: "EASY",
        tags: ["Implementation"],
        trackType: "CP",
        topicSlug: "rating-800",
        platformSource: "CODEFORCES",
        platformUrl: "https://codeforces.com/problemset/problem/158/A",
        boilerplate: {
            PYTHON: `n, k = map(int, input().split())
scores = list(map(int, input().split()))
# Count participants scoring >= scores[k-1] and > 0
`,
        },
        testCases: [
            { input: "8 5\n10 9 8 7 7 7 5 5", expectedOutput: "6", isHidden: false },
            { input: "5 2\n0 0 0 0 0", expectedOutput: "0", isHidden: false },
        ]
    },
    {
        title: "String Task",
        slug: "cf-118a-string-task",
        description: "Petya started to attend programming lessons. On the first lesson his task was to type the word that his teacher said. Petya's word should satisfy:\n1. Delete all vowels (A, O, Y, E, U, I)\n2. Insert '.' before each remaining consonant\n3. Convert to lowercase",
        constraints: "1 <= |s| <= 100",
        examples: [
            { input: "tour", output: ".t.r" },
            { input: "Codeforces", output: ".c.d.f.r.c.s" },
        ],
        difficulty: "EASY",
        tags: ["Strings", "Implementation"],
        trackType: "CP",
        topicSlug: "rating-1000",
        platformSource: "CODEFORCES",
        platformUrl: "https://codeforces.com/problemset/problem/118/A",
        boilerplate: {
            PYTHON: `s = input().lower()
vowels = set('aeiouy')
# Build result: for each non-vowel char, prepend '.'
`,
        },
        testCases: [
            { input: "tour", expectedOutput: ".t.r", isHidden: false },
            { input: "Codeforces", expectedOutput: ".c.d.f.r.c.s", isHidden: false },
            { input: "aBAcAba", expectedOutput: ".b.c.b", isHidden: true },
        ]
    },
];

async function main() {
    console.log("🌱 Seeding additional problems...\n");
    let created = 0, skipped = 0;

    for (const p of MORE_PROBLEMS) {
        const existing = await prisma.problem.findUnique({ where: { slug: p.slug } });
        if (existing) { console.log(`  ⏭  "${p.title}" exists`); skipped++; continue; }

        const topic = await prisma.topic.findUnique({ where: { slug: p.topicSlug } });

        const problem = await prisma.problem.create({
            data: {
                title: p.title, slug: p.slug, description: p.description,
                constraints: p.constraints, examples: p.examples,
                difficulty: p.difficulty, tags: p.tags, trackType: p.trackType,
                topicId: topic?.id || null,
                platformSource: p.platformSource, platformUrl: p.platformUrl || null,
                timeComplexity: p.timeComplexity || null,
                boilerplate: p.boilerplate, isPublished: true, order: created + 20,
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

    console.log(`\n🎉 Created ${created}, skipped ${skipped}. Total now: ${created + skipped + 20} problems.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
