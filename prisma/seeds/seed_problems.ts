import { PrismaClient, TrackType, Difficulty, PlatformSource } from "@prisma/client";

const prisma = new PrismaClient();

interface ProblemSeed {
    title: string;
    slug: string;
    description: string;
    constraints: string;
    examples: { input: string; output: string; explanation?: string }[];
    difficulty: Difficulty;
    tags: string[];
    trackType: TrackType;
    topicSlug: string;
    subtopicSlug?: string;
    platformSource: PlatformSource;
    platformUrl?: string;
    timeComplexity?: string;
    spaceComplexity?: string;
    boilerplate: Record<string, string>;
    testCases: { input: string; expectedOutput: string; isHidden: boolean }[];
}

const DSA_PROBLEMS: ProblemSeed[] = [
    // ═══ ARRAYS ═══
    {
        title: "Two Sum",
        slug: "two-sum",
        description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
        constraints: "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9\nOnly one valid answer exists.",
        examples: [
            { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
            { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
        ],
        difficulty: "EASY",
        tags: ["Array", "Hash Table"],
        trackType: "DSA",
        topicSlug: "arrays",
        platformSource: "LEETCODE",
        platformUrl: "https://leetcode.com/problems/two-sum/",
        timeComplexity: "n",
        spaceComplexity: "n",
        boilerplate: {
            PYTHON: "def twoSum(nums, target):\n    # Write your solution here\n    pass\n\n# Read input\nimport sys\ndata = sys.stdin.read().split()\nn = int(data[0])\nnums = list(map(int, data[1:n+1]))\ntarget = int(data[n+1])\nresult = twoSum(nums, target)\nprint(result)",
            JAVASCRIPT: "function twoSum(nums, target) {\n    // Write your solution here\n}\n\n// Read input\nconst input = require('fs').readFileSync(0,'utf-8').trim().split('\\n');\nconst nums = input[0].split(' ').map(Number);\nconst target = Number(input[1]);\nconsole.log(JSON.stringify(twoSum(nums, target)));",
            CPP: "#include <bits/stdc++.h>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    // Write your solution here\n    return {};\n}\n\nint main() {\n    int n, target;\n    cin >> n;\n    vector<int> nums(n);\n    for(int i = 0; i < n; i++) cin >> nums[i];\n    cin >> target;\n    auto res = twoSum(nums, target);\n    cout << \"[\" << res[0] << \",\" << res[1] << \"]\" << endl;\n}",
            JAVA: "import java.util.*;\n\npublic class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your solution here\n        return new int[]{};\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for(int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int target = sc.nextInt();\n        int[] res = new Solution().twoSum(nums, target);\n        System.out.println(\"[\" + res[0] + \",\" + res[1] + \"]\");\n    }\n}"
        },
        testCases: [
            { input: "4\n2 7 11 15\n9", expectedOutput: "[0,1]", isHidden: false },
            { input: "3\n3 2 4\n6", expectedOutput: "[1,2]", isHidden: false },
            { input: "2\n3 3\n6", expectedOutput: "[0,1]", isHidden: true },
        ]
    },
    {
        title: "Best Time to Buy and Sell Stock",
        slug: "best-time-to-buy-and-sell-stock",
        description: "You are given an array `prices` where `prices[i]` is the price of a given stock on the i-th day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.",
        constraints: "1 <= prices.length <= 10^5\n0 <= prices[i] <= 10^4",
        examples: [
            { input: "prices = [7,1,5,3,6,4]", output: "5", explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5." },
            { input: "prices = [7,6,4,3,1]", output: "0", explanation: "No profitable transaction possible." },
        ],
        difficulty: "EASY",
        tags: ["Array", "Dynamic Programming"],
        trackType: "DSA",
        topicSlug: "arrays",
        platformSource: "LEETCODE",
        timeComplexity: "n",
        boilerplate: {
            PYTHON: "def maxProfit(prices):\n    pass\n\nimport sys\ndata = list(map(int, sys.stdin.read().split()))\nprint(maxProfit(data))",
            JAVASCRIPT: "function maxProfit(prices) {\n    // your code\n}\nconst prices = require('fs').readFileSync(0,'utf-8').trim().split(' ').map(Number);\nconsole.log(maxProfit(prices));",
        },
        testCases: [
            { input: "7 1 5 3 6 4", expectedOutput: "5", isHidden: false },
            { input: "7 6 4 3 1", expectedOutput: "0", isHidden: false },
            { input: "2 4 1", expectedOutput: "2", isHidden: true },
        ]
    },
    {
        title: "Contains Duplicate",
        slug: "contains-duplicate",
        description: "Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.",
        constraints: "1 <= nums.length <= 10^5\n-10^9 <= nums[i] <= 10^9",
        examples: [
            { input: "nums = [1,2,3,1]", output: "true" },
            { input: "nums = [1,2,3,4]", output: "false" },
        ],
        difficulty: "EASY",
        tags: ["Array", "Hash Table", "Sorting"],
        trackType: "DSA",
        topicSlug: "arrays",
        platformSource: "LEETCODE",
        timeComplexity: "n",
        boilerplate: {
            PYTHON: "def containsDuplicate(nums):\n    pass\n\nimport sys\ndata = list(map(int, sys.stdin.read().split()))\nprint(str(containsDuplicate(data)).lower())",
        },
        testCases: [
            { input: "1 2 3 1", expectedOutput: "true", isHidden: false },
            { input: "1 2 3 4", expectedOutput: "false", isHidden: false },
            { input: "1 1 1 3 3 4 3 2 4 2", expectedOutput: "true", isHidden: true },
        ]
    },
    {
        title: "Maximum Subarray",
        slug: "maximum-subarray",
        description: "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.\n\nA subarray is a contiguous non-empty sequence of elements within an array.",
        constraints: "1 <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4",
        examples: [
            { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "The subarray [4,-1,2,1] has the largest sum 6." },
            { input: "nums = [1]", output: "1" },
        ],
        difficulty: "MEDIUM",
        tags: ["Array", "Dynamic Programming", "Divide and Conquer"],
        trackType: "DSA",
        topicSlug: "arrays",
        platformSource: "LEETCODE",
        timeComplexity: "n",
        boilerplate: {
            PYTHON: "def maxSubArray(nums):\n    pass\n\nimport sys\ndata = list(map(int, sys.stdin.read().split()))\nprint(maxSubArray(data))",
        },
        testCases: [
            { input: "-2 1 -3 4 -1 2 1 -5 4", expectedOutput: "6", isHidden: false },
            { input: "1", expectedOutput: "1", isHidden: false },
            { input: "5 4 -1 7 8", expectedOutput: "23", isHidden: true },
        ]
    },
    // ═══ STRINGS ═══
    {
        title: "Valid Anagram",
        slug: "valid-anagram",
        description: "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
        constraints: "1 <= s.length, t.length <= 5 * 10^4\ns and t consist of lowercase English letters.",
        examples: [
            { input: "s = \"anagram\", t = \"nagaram\"", output: "true" },
            { input: "s = \"rat\", t = \"car\"", output: "false" },
        ],
        difficulty: "EASY",
        tags: ["Hash Table", "String", "Sorting"],
        trackType: "DSA",
        topicSlug: "strings",
        platformSource: "LEETCODE",
        timeComplexity: "n",
        boilerplate: {
            PYTHON: "def isAnagram(s, t):\n    pass\n\nimport sys\nlines = sys.stdin.read().strip().split('\\n')\nprint(str(isAnagram(lines[0], lines[1])).lower())",
        },
        testCases: [
            { input: "anagram\nnagaram", expectedOutput: "true", isHidden: false },
            { input: "rat\ncar", expectedOutput: "false", isHidden: false },
        ]
    },
    {
        title: "Longest Substring Without Repeating Characters",
        slug: "longest-substring-without-repeating-characters",
        description: "Given a string `s`, find the length of the longest substring without repeating characters.",
        constraints: "0 <= s.length <= 5 * 10^4\ns consists of English letters, digits, symbols and spaces.",
        examples: [
            { input: "s = \"abcabcbb\"", output: "3", explanation: "The answer is 'abc', with the length of 3." },
            { input: "s = \"bbbbb\"", output: "1" },
            { input: "s = \"pwwkew\"", output: "3" },
        ],
        difficulty: "MEDIUM",
        tags: ["Hash Table", "String", "Sliding Window"],
        trackType: "DSA",
        topicSlug: "strings",
        platformSource: "LEETCODE",
        timeComplexity: "n",
        boilerplate: {
            PYTHON: "def lengthOfLongestSubstring(s):\n    pass\n\nimport sys\ns = sys.stdin.read().strip()\nprint(lengthOfLongestSubstring(s))",
        },
        testCases: [
            { input: "abcabcbb", expectedOutput: "3", isHidden: false },
            { input: "bbbbb", expectedOutput: "1", isHidden: false },
            { input: "pwwkew", expectedOutput: "3", isHidden: true },
        ]
    },
    // ═══ LINKED LIST ═══
    {
        title: "Reverse Linked List",
        slug: "reverse-linked-list",
        description: "Given the `head` of a singly linked list, reverse the list, and return the reversed list.\n\nInput is given as space-separated values. Output the reversed list as space-separated values.",
        constraints: "0 <= Number of nodes <= 5000\n-5000 <= Node.val <= 5000",
        examples: [
            { input: "1 2 3 4 5", output: "5 4 3 2 1" },
            { input: "1 2", output: "2 1" },
        ],
        difficulty: "EASY",
        tags: ["Linked List", "Recursion"],
        trackType: "DSA",
        topicSlug: "linked-list",
        platformSource: "LEETCODE",
        timeComplexity: "n",
        boilerplate: {
            PYTHON: "import sys\ndata = list(map(int, sys.stdin.read().split()))\ndata.reverse()\nprint(' '.join(map(str, data)))",
        },
        testCases: [
            { input: "1 2 3 4 5", expectedOutput: "5 4 3 2 1", isHidden: false },
            { input: "1 2", expectedOutput: "2 1", isHidden: false },
        ]
    },
    // ═══ BINARY SEARCH ═══
    {
        title: "Binary Search",
        slug: "binary-search",
        description: "Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, return its index. Otherwise, return `-1`.",
        constraints: "1 <= nums.length <= 10^4\n-10^4 < nums[i], target < 10^4\nAll the integers in nums are unique.\nnums is sorted in ascending order.",
        examples: [
            { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4" },
            { input: "nums = [-1,0,3,5,9,12], target = 2", output: "-1" },
        ],
        difficulty: "EASY",
        tags: ["Array", "Binary Search"],
        trackType: "DSA",
        topicSlug: "binary-search",
        platformSource: "LEETCODE",
        timeComplexity: "log n",
        boilerplate: {
            PYTHON: "def search(nums, target):\n    pass\n\nimport sys\ndata = sys.stdin.read().split()\nn = int(data[0])\nnums = list(map(int, data[1:n+1]))\ntarget = int(data[n+1])\nprint(search(nums, target))",
        },
        testCases: [
            { input: "6\n-1 0 3 5 9 12\n9", expectedOutput: "4", isHidden: false },
            { input: "6\n-1 0 3 5 9 12\n2", expectedOutput: "-1", isHidden: false },
        ]
    },
    // ═══ TREES ═══
    {
        title: "Maximum Depth of Binary Tree",
        slug: "maximum-depth-of-binary-tree",
        description: "Given the root of a binary tree, return its maximum depth.\n\nA binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.\n\nInput is given as a level-order traversal with 'null' for missing nodes.",
        constraints: "0 <= Number of nodes <= 10^4\n-100 <= Node.val <= 100",
        examples: [
            { input: "3 9 20 null null 15 7", output: "3" },
            { input: "1 null 2", output: "2" },
        ],
        difficulty: "EASY",
        tags: ["Tree", "DFS", "BFS", "Binary Tree"],
        trackType: "DSA",
        topicSlug: "trees",
        platformSource: "LEETCODE",
        timeComplexity: "n",
        boilerplate: {
            PYTHON: "import sys\nfrom collections import deque\n\ndef maxDepth(values):\n    if not values or values[0] == 'null':\n        return 0\n    # Build tree from level order and compute depth\n    # Your solution here\n    pass\n\ndata = sys.stdin.read().split()\nprint(maxDepth(data))",
        },
        testCases: [
            { input: "3 9 20 null null 15 7", expectedOutput: "3", isHidden: false },
            { input: "1 null 2", expectedOutput: "2", isHidden: false },
        ]
    },
    // ═══ DYNAMIC PROGRAMMING ═══
    {
        title: "Climbing Stairs",
        slug: "climbing-stairs",
        description: "You are climbing a staircase. It takes `n` steps to reach the top.\n\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
        constraints: "1 <= n <= 45",
        examples: [
            { input: "n = 2", output: "2", explanation: "1. 1 step + 1 step\n2. 2 steps" },
            { input: "n = 3", output: "3", explanation: "1. 1+1+1\n2. 1+2\n3. 2+1" },
        ],
        difficulty: "EASY",
        tags: ["Math", "Dynamic Programming", "Memoization"],
        trackType: "DSA",
        topicSlug: "dynamic-programming",
        platformSource: "LEETCODE",
        timeComplexity: "n",
        boilerplate: {
            PYTHON: "def climbStairs(n):\n    pass\n\nimport sys\nn = int(sys.stdin.read().strip())\nprint(climbStairs(n))",
        },
        testCases: [
            { input: "2", expectedOutput: "2", isHidden: false },
            { input: "3", expectedOutput: "3", isHidden: false },
            { input: "5", expectedOutput: "8", isHidden: true },
            { input: "10", expectedOutput: "89", isHidden: true },
        ]
    },
    {
        title: "House Robber",
        slug: "house-robber",
        description: "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night.\n\nGiven an integer array `nums` representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.",
        constraints: "1 <= nums.length <= 100\n0 <= nums[i] <= 400",
        examples: [
            { input: "nums = [1,2,3,1]", output: "4", explanation: "Rob house 1 (money = 1) and then rob house 3 (money = 3). Total = 1 + 3 = 4." },
            { input: "nums = [2,7,9,3,1]", output: "12" },
        ],
        difficulty: "MEDIUM",
        tags: ["Array", "Dynamic Programming"],
        trackType: "DSA",
        topicSlug: "dynamic-programming",
        platformSource: "LEETCODE",
        timeComplexity: "n",
        boilerplate: {
            PYTHON: "def rob(nums):\n    pass\n\nimport sys\nnums = list(map(int, sys.stdin.read().split()))\nprint(rob(nums))",
        },
        testCases: [
            { input: "1 2 3 1", expectedOutput: "4", isHidden: false },
            { input: "2 7 9 3 1", expectedOutput: "12", isHidden: false },
            { input: "2 1 1 2", expectedOutput: "4", isHidden: true },
        ]
    },
    // ═══ STACK ═══
    {
        title: "Valid Parentheses",
        slug: "valid-parentheses",
        description: "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
        constraints: "1 <= s.length <= 10^4\ns consists of parentheses only '()[]{}'.",
        examples: [
            { input: "s = \"()\"", output: "true" },
            { input: "s = \"()[]{}\"", output: "true" },
            { input: "s = \"(]\"", output: "false" },
        ],
        difficulty: "EASY",
        tags: ["String", "Stack"],
        trackType: "DSA",
        topicSlug: "stacks-queues",
        platformSource: "LEETCODE",
        timeComplexity: "n",
        boilerplate: {
            PYTHON: "def isValid(s):\n    pass\n\nimport sys\ns = sys.stdin.read().strip()\nprint(str(isValid(s)).lower())",
        },
        testCases: [
            { input: "()", expectedOutput: "true", isHidden: false },
            { input: "()[]{}", expectedOutput: "true", isHidden: false },
            { input: "(]", expectedOutput: "false", isHidden: false },
            { input: "([)]", expectedOutput: "false", isHidden: true },
        ]
    },
    // ═══ GRAPHS ═══
    {
        title: "Number of Islands",
        slug: "number-of-islands",
        description: "Given an `m x n` 2D binary grid `grid` which represents a map of '1's (land) and '0's (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.",
        constraints: "m == grid.length\nn == grid[i].length\n1 <= m, n <= 300\ngrid[i][j] is '0' or '1'.",
        examples: [
            { input: "grid = [[\"1\",\"1\",\"1\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"0\",\"0\"]]", output: "1" },
            { input: "grid = [[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]", output: "3" },
        ],
        difficulty: "MEDIUM",
        tags: ["Array", "DFS", "BFS", "Graph"],
        trackType: "DSA",
        topicSlug: "graphs",
        platformSource: "LEETCODE",
        timeComplexity: "m*n",
        boilerplate: {
            PYTHON: "import sys\n\ndef numIslands(grid):\n    pass\n\nlines = sys.stdin.read().strip().split('\\n')\nm = int(lines[0])\nn = int(lines[1])\ngrid = []\nfor i in range(m):\n    grid.append(list(lines[2+i]))\nprint(numIslands(grid))",
        },
        testCases: [
            { input: "4\n5\n11110\n11010\n11000\n00000", expectedOutput: "1", isHidden: false },
            { input: "4\n5\n11000\n11000\n00100\n00011", expectedOutput: "3", isHidden: false },
        ]
    },
    // ═══ TWO POINTERS ═══
    {
        title: "Container With Most Water",
        slug: "container-with-most-water",
        description: "You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the i-th line are `(i, 0)` and `(i, height[i])`.\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn the maximum amount of water a container can store.",
        constraints: "n == height.length\n2 <= n <= 10^5\n0 <= height[i] <= 10^4",
        examples: [
            { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49" },
            { input: "height = [1,1]", output: "1" },
        ],
        difficulty: "MEDIUM",
        tags: ["Array", "Two Pointers", "Greedy"],
        trackType: "DSA",
        topicSlug: "two-pointers",
        platformSource: "LEETCODE",
        timeComplexity: "n",
        boilerplate: {
            PYTHON: "def maxArea(height):\n    pass\n\nimport sys\ndata = list(map(int, sys.stdin.read().split()))\nprint(maxArea(data))",
        },
        testCases: [
            { input: "1 8 6 2 5 4 8 3 7", expectedOutput: "49", isHidden: false },
            { input: "1 1", expectedOutput: "1", isHidden: false },
        ]
    },
    // ═══ GREEDY ═══
    {
        title: "Jump Game",
        slug: "jump-game",
        description: "You are given an integer array `nums`. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position.\n\nReturn `true` if you can reach the last index, or `false` otherwise.",
        constraints: "1 <= nums.length <= 10^4\n0 <= nums[i] <= 10^5",
        examples: [
            { input: "nums = [2,3,1,1,4]", output: "true", explanation: "Jump 1 step from index 0 to 1, then 3 steps to the last index." },
            { input: "nums = [3,2,1,0,4]", output: "false" },
        ],
        difficulty: "MEDIUM",
        tags: ["Array", "Greedy", "Dynamic Programming"],
        trackType: "DSA",
        topicSlug: "greedy",
        platformSource: "LEETCODE",
        timeComplexity: "n",
        boilerplate: {
            PYTHON: "def canJump(nums):\n    pass\n\nimport sys\nnums = list(map(int, sys.stdin.read().split()))\nprint(str(canJump(nums)).lower())",
        },
        testCases: [
            { input: "2 3 1 1 4", expectedOutput: "true", isHidden: false },
            { input: "3 2 1 0 4", expectedOutput: "false", isHidden: false },
        ]
    },
];

// ═══ CP PROBLEMS ═══
const CP_PROBLEMS: ProblemSeed[] = [
    {
        title: "Watermelon",
        slug: "cf-4a-watermelon",
        description: "Pete and Billy have a watermelon that weighs `w` kilos. They want to divide it into two parts so that each part weighs an even number of kilos.\n\nIs it possible to do this?",
        constraints: "1 <= w <= 100",
        examples: [
            { input: "8", output: "YES", explanation: "For example 2+6." },
        ],
        difficulty: "EASY",
        tags: ["Math", "Brute Force"],
        trackType: "CP",
        topicSlug: "rating-800",
        platformSource: "CODEFORCES",
        platformUrl: "https://codeforces.com/problemset/problem/4/A",
        boilerplate: {
            PYTHON: "w = int(input())\n# Your solution here",
        },
        testCases: [
            { input: "8", expectedOutput: "YES", isHidden: false },
            { input: "3", expectedOutput: "NO", isHidden: false },
            { input: "2", expectedOutput: "NO", isHidden: true },
            { input: "4", expectedOutput: "YES", isHidden: true },
        ]
    },
    {
        title: "Way Too Long Words",
        slug: "cf-71a-way-too-long-words",
        description: "Sometimes some words like 'localization' or 'internationalization' are so long that writing them many times in one text is quite tiresome.\n\nSo it was suggested to abbreviate such words. A word is abbreviated by replacing the letters between the first and last by the count of omitted letters.\n\nGiven a word, print the abbreviated version if the word has more than 10 characters; otherwise print it unchanged.",
        constraints: "1 <= n <= 100\n1 <= |word| <= 100",
        examples: [
            { input: "4\nword\nlocalization\nabcdefghijklmnop\nI", output: "word\nl10n\na14p\nI" },
        ],
        difficulty: "EASY",
        tags: ["Strings", "Implementation"],
        trackType: "CP",
        topicSlug: "rating-800",
        platformSource: "CODEFORCES",
        platformUrl: "https://codeforces.com/problemset/problem/71/A",
        boilerplate: {
            PYTHON: "n = int(input())\nfor _ in range(n):\n    word = input()\n    # Your solution here",
        },
        testCases: [
            { input: "4\nword\nlocalization\nabcdefghijklmnop\nI", expectedOutput: "word\nl10n\na14p\nI", isHidden: false },
        ]
    },
    {
        title: "Theatre Square",
        slug: "cf-1a-theatre-square",
        description: "Theatre Square in the capital city has a rectangular shape with dimensions `n × m` meters. To tile the square, flagstones of size `a × a` are used.\n\nWhat is the least number of flagstones needed to pave the Theatre Square? (It's allowed to cover the surface larger than the Theatre Square).",
        constraints: "1 <= n, m, a <= 10^9",
        examples: [
            { input: "6 6 4", output: "4" },
        ],
        difficulty: "EASY",
        tags: ["Math"],
        trackType: "CP",
        topicSlug: "rating-1000",
        platformSource: "CODEFORCES",
        platformUrl: "https://codeforces.com/problemset/problem/1/A",
        boilerplate: {
            PYTHON: "n, m, a = map(int, input().split())\n# Your solution here",
        },
        testCases: [
            { input: "6 6 4", expectedOutput: "4", isHidden: false },
            { input: "1 1 1", expectedOutput: "1", isHidden: true },
            { input: "2 3 4", expectedOutput: "1", isHidden: true },
        ]
    },
    {
        title: "Nearly Lucky Number",
        slug: "cf-110a-nearly-lucky-number",
        description: "Petya loves lucky numbers. A lucky number is a positive integer whose decimal representation contains only the lucky digits 4 and 7.\n\nA nearly lucky number is an integer where the count of lucky digits (4 and 7) in its decimal representation is itself a lucky number.\n\nDetermine whether the given number `n` is nearly lucky.",
        constraints: "1 <= n <= 10^18",
        examples: [
            { input: "40047", output: "YES", explanation: "Lucky digits: 4, 0, 0, 4, 7 → 3 lucky digits (4,4,7) → count=3, 3 is not lucky → NO. Wait: count of lucky digits is 3. 3 is not a lucky number. So output is NO." },
            { input: "7747774", output: "YES", explanation: "All 7 digits are lucky. 7 is a lucky number. So output is YES." },
        ],
        difficulty: "EASY",
        tags: ["Implementation"],
        trackType: "CP",
        topicSlug: "rating-800",
        platformSource: "CODEFORCES",
        boilerplate: {
            PYTHON: "n = input()\n# count lucky digits, check if count is lucky\n",
        },
        testCases: [
            { input: "7747774", expectedOutput: "YES", isHidden: false },
            { input: "1000000", expectedOutput: "NO", isHidden: false },
            { input: "4447", expectedOutput: "YES", isHidden: true },
        ]
    },
    {
        title: "Elephant",
        slug: "cf-617a-elephant",
        description: "An elephant decided to visit his friend, who lives `x` cells away from him. In one step, the elephant can move 1, 2, 3, 4, or 5 cells forward. What is the minimum number of steps the elephant needs to make?",
        constraints: "1 <= x <= 1000000",
        examples: [
            { input: "5", output: "1" },
            { input: "12", output: "3" },
        ],
        difficulty: "EASY",
        tags: ["Math", "Greedy"],
        trackType: "CP",
        topicSlug: "rating-800",
        platformSource: "CODEFORCES",
        boilerplate: {
            PYTHON: "x = int(input())\n# Your solution here",
        },
        testCases: [
            { input: "5", expectedOutput: "1", isHidden: false },
            { input: "12", expectedOutput: "3", isHidden: false },
            { input: "1000000", expectedOutput: "200000", isHidden: true },
        ]
    },
];

async function main() {
    console.log("🌱 Seeding problems...\n");

    const allProblems = [...DSA_PROBLEMS, ...CP_PROBLEMS];
    let created = 0;
    let skipped = 0;

    for (const p of allProblems) {
        // Check if problem already exists
        const existing = await prisma.problem.findUnique({ where: { slug: p.slug } });
        if (existing) {
            console.log(`  ⏭  Skipping "${p.title}" (already exists)`);
            skipped++;
            continue;
        }

        // Find topic
        const topic = await prisma.topic.findUnique({ where: { slug: p.topicSlug } });

        // Find subtopic if specified
        let subtopic = null;
        if (p.subtopicSlug && topic) {
            subtopic = await prisma.subtopic.findFirst({
                where: { topicId: topic.id, slug: p.subtopicSlug }
            });
        }

        const problem = await prisma.problem.create({
            data: {
                title: p.title,
                slug: p.slug,
                description: p.description,
                constraints: p.constraints,
                examples: p.examples,
                difficulty: p.difficulty,
                tags: p.tags,
                trackType: p.trackType,
                topicId: topic?.id || null,
                subtopicId: subtopic?.id || null,
                platformSource: p.platformSource,
                platformUrl: p.platformUrl || null,
                timeComplexity: p.timeComplexity || null,
                spaceComplexity: p.spaceComplexity || null,
                boilerplate: p.boilerplate,
                isPublished: true,
                order: created,
            }
        });

        // Create test cases
        for (let i = 0; i < p.testCases.length; i++) {
            const tc = p.testCases[i];
            await prisma.testCase.create({
                data: {
                    problemId: problem.id,
                    input: tc.input,
                    expectedOutput: tc.expectedOutput,
                    isHidden: tc.isHidden,
                    isExample: !tc.isHidden,
                    order: i,
                }
            });
        }

        console.log(`  ✅ Created "${p.title}" (${p.difficulty}) with ${p.testCases.length} test cases`);
        created++;
    }

    console.log(`\n🎉 Done! Created ${created} problems, skipped ${skipped}.`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
