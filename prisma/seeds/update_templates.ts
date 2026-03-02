import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// LeetCode-style solution templates for each problem
const BOILERPLATE_UPDATES: Record<string, Record<string, string>> = {
    "two-sum": {
        PYTHON: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        # Write your solution here
        pass

# --- Do not modify below ---
import sys, json
sol = Solution()
data = sys.stdin.read().split("\\n")
nums = json.loads(data[0])
target = int(data[1])
print(json.dumps(sol.twoSum(nums, target)))`,
        JAVASCRIPT: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // Write your solution here
};

// --- Do not modify below ---
const input = require('fs').readFileSync(0,'utf-8').trim().split('\\n');
const nums = JSON.parse(input[0]);
const target = Number(input[1]);
console.log(JSON.stringify(twoSum(nums, target)));`,
        CPP: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your solution here
        return {};
    }
};

// --- Do not modify below ---
int main() {
    int n;
    cin >> n;
    vector<int> nums(n);
    for(int i=0;i<n;i++) cin >> nums[i];
    int target;
    cin >> target;
    auto res = Solution().twoSum(nums, target);
    cout << "[" << res[0] << "," << res[1] << "]" << endl;
}`,
        JAVA: `import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        return new int[]{};
    }

    // --- Do not modify below ---
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for(int i=0;i<n;i++) nums[i] = sc.nextInt();
        int target = sc.nextInt();
        int[] res = new Solution().twoSum(nums, target);
        System.out.println("["+res[0]+","+res[1]+"]");
    }
}`
    },
    "best-time-to-buy-and-sell-stock": {
        PYTHON: `class Solution:
    def maxProfit(self, prices: list[int]) -> int:
        # Write your solution here
        pass

# --- Do not modify below ---
import sys, json
sol = Solution()
prices = json.loads(sys.stdin.read().strip())
print(sol.maxProfit(prices))`,
        JAVASCRIPT: `/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
    // Write your solution here
};

const prices = JSON.parse(require('fs').readFileSync(0,'utf-8').trim());
console.log(maxProfit(prices));`,
        CPP: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int maxProfit(vector<int>& prices) {
        // Write your solution here
        return 0;
    }
};

int main() {
    int n; cin >> n;
    vector<int> p(n);
    for(int i=0;i<n;i++) cin >> p[i];
    cout << Solution().maxProfit(p) << endl;
}`,
        JAVA: `import java.util.*;
class Solution {
    public int maxProfit(int[] prices) {
        // Write your solution here
        return 0;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] p = new int[n];
        for(int i=0;i<n;i++) p[i] = sc.nextInt();
        System.out.println(new Solution().maxProfit(p));
    }
}`
    },
    "contains-duplicate": {
        PYTHON: `class Solution:
    def containsDuplicate(self, nums: list[int]) -> bool:
        # Write your solution here
        pass

import sys, json
sol = Solution()
nums = json.loads(sys.stdin.read().strip())
print(str(sol.containsDuplicate(nums)).lower())`,
        JAVASCRIPT: `var containsDuplicate = function(nums) {
    // Write your solution here
};
const nums = JSON.parse(require('fs').readFileSync(0,'utf-8').trim());
console.log(containsDuplicate(nums) ? "true" : "false");`,
    },
    "maximum-subarray": {
        PYTHON: `class Solution:
    def maxSubArray(self, nums: list[int]) -> int:
        # Write your solution here
        pass

import sys, json
sol = Solution()
nums = json.loads(sys.stdin.read().strip())
print(sol.maxSubArray(nums))`,
        JAVASCRIPT: `var maxSubArray = function(nums) {
    // Write your solution here
};
const nums = JSON.parse(require('fs').readFileSync(0,'utf-8').trim());
console.log(maxSubArray(nums));`,
    },
    "valid-anagram": {
        PYTHON: `class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        # Write your solution here
        pass

import sys
sol = Solution()
lines = sys.stdin.read().strip().split("\\n")
print(str(sol.isAnagram(lines[0], lines[1])).lower())`,
        JAVASCRIPT: `var isAnagram = function(s, t) {
    // Write your solution here
};
const lines = require('fs').readFileSync(0,'utf-8').trim().split('\\n');
console.log(isAnagram(lines[0], lines[1]) ? "true" : "false");`,
    },
    "longest-substring-without-repeating-characters": {
        PYTHON: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        # Write your solution here
        pass

import sys
sol = Solution()
s = sys.stdin.read().strip()
print(sol.lengthOfLongestSubstring(s))`,
        JAVASCRIPT: `var lengthOfLongestSubstring = function(s) {
    // Write your solution here
};
const s = require('fs').readFileSync(0,'utf-8').trim();
console.log(lengthOfLongestSubstring(s));`,
    },
    "reverse-linked-list": {
        PYTHON: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def reverseList(self, head: ListNode) -> ListNode:
        # Write your solution here
        pass

import sys
data = list(map(int, sys.stdin.read().split()))
# Build list
head = None
for v in reversed(data):
    head = ListNode(v, head)
result = Solution().reverseList(head)
out = []
while result:
    out.append(str(result.val))
    result = result.next
print(" ".join(out))`,
        JAVASCRIPT: `function ListNode(val, next) {
    this.val = (val===undefined ? 0 : val);
    this.next = (next===undefined ? null : next);
}
var reverseList = function(head) {
    // Write your solution here
};
const data = require('fs').readFileSync(0,'utf-8').trim().split(' ').map(Number);
let head = null;
for(let i=data.length-1;i>=0;i--) head = new ListNode(data[i], head);
let res = reverseList(head);
const out = [];
while(res) { out.push(res.val); res = res.next; }
console.log(out.join(' '));`,
    },
    "binary-search": {
        PYTHON: `class Solution:
    def search(self, nums: list[int], target: int) -> int:
        # Write your solution here
        pass

import sys, json
sol = Solution()
lines = sys.stdin.read().strip().split("\\n")
nums = json.loads(lines[0])
target = int(lines[1])
print(sol.search(nums, target))`,
        JAVASCRIPT: `var search = function(nums, target) {
    // Write your solution here
};
const lines = require('fs').readFileSync(0,'utf-8').trim().split('\\n');
const nums = JSON.parse(lines[0]);
const target = Number(lines[1]);
console.log(search(nums, target));`,
    },
    "climbing-stairs": {
        PYTHON: `class Solution:
    def climbStairs(self, n: int) -> int:
        # Write your solution here
        pass

import sys
n = int(sys.stdin.read().strip())
print(Solution().climbStairs(n))`,
        JAVASCRIPT: `var climbStairs = function(n) {
    // Write your solution here
};
const n = Number(require('fs').readFileSync(0,'utf-8').trim());
console.log(climbStairs(n));`,
    },
    "house-robber": {
        PYTHON: `class Solution:
    def rob(self, nums: list[int]) -> int:
        # Write your solution here
        pass

import sys, json
nums = json.loads(sys.stdin.read().strip())
print(Solution().rob(nums))`,
        JAVASCRIPT: `var rob = function(nums) {
    // Write your solution here
};
const nums = JSON.parse(require('fs').readFileSync(0,'utf-8').trim());
console.log(rob(nums));`,
    },
    "valid-parentheses": {
        PYTHON: `class Solution:
    def isValid(self, s: str) -> bool:
        # Write your solution here
        pass

import sys
s = sys.stdin.read().strip()
print(str(Solution().isValid(s)).lower())`,
        JAVASCRIPT: `var isValid = function(s) {
    // Write your solution here
};
const s = require('fs').readFileSync(0,'utf-8').trim();
console.log(isValid(s) ? "true" : "false");`,
    },
    "number-of-islands": {
        PYTHON: `class Solution:
    def numIslands(self, grid: list[list[str]]) -> int:
        # Write your solution here
        pass

import sys
lines = sys.stdin.read().strip().split("\\n")
m = int(lines[0])
n = int(lines[1])
grid = [list(lines[2+i]) for i in range(m)]
print(Solution().numIslands(grid))`,
        JAVASCRIPT: `var numIslands = function(grid) {
    // Write your solution here
};
const lines = require('fs').readFileSync(0,'utf-8').trim().split('\\n');
const m = Number(lines[0]), n = Number(lines[1]);
const grid = [];
for(let i=0;i<m;i++) grid.push(lines[2+i].split(''));
console.log(numIslands(grid));`,
    },
    "container-with-most-water": {
        PYTHON: `class Solution:
    def maxArea(self, height: list[int]) -> int:
        # Write your solution here
        pass

import sys, json
height = json.loads(sys.stdin.read().strip())
print(Solution().maxArea(height))`,
        JAVASCRIPT: `var maxArea = function(height) {
    // Write your solution here
};
const height = JSON.parse(require('fs').readFileSync(0,'utf-8').trim());
console.log(maxArea(height));`,
    },
    "jump-game": {
        PYTHON: `class Solution:
    def canJump(self, nums: list[int]) -> bool:
        # Write your solution here
        pass

import sys, json
nums = json.loads(sys.stdin.read().strip())
print(str(Solution().canJump(nums)).lower())`,
        JAVASCRIPT: `var canJump = function(nums) {
    // Write your solution here
};
const nums = JSON.parse(require('fs').readFileSync(0,'utf-8').trim());
console.log(canJump(nums) ? "true" : "false");`,
    },
    "maximum-depth-of-binary-tree": {
        PYTHON: `from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def maxDepth(self, root: TreeNode) -> int:
        # Write your solution here
        pass

import sys
data = sys.stdin.read().split()
if not data or data[0] == 'null':
    print(0)
else:
    nodes = [TreeNode(int(v)) if v != 'null' else None for v in data]
    for i in range(len(nodes)):
        if nodes[i]:
            l = 2*i+1
            r = 2*i+2
            if l < len(nodes): nodes[i].left = nodes[l]
            if r < len(nodes): nodes[i].right = nodes[r]
    print(Solution().maxDepth(nodes[0]))`,
    },
    // CP problems - simpler templates
    "cf-4a-watermelon": {
        PYTHON: `w = int(input())
# Your solution: print YES or NO
`,
        CPP: `#include <bits/stdc++.h>
using namespace std;
int main() {
    int w;
    cin >> w;
    // Your solution: print YES or NO
    return 0;
}`,
    },
    "cf-71a-way-too-long-words": {
        PYTHON: `n = int(input())
for _ in range(n):
    word = input()
    # Abbreviate if len > 10
`,
        CPP: `#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    while(n--) {
        string s;
        cin >> s;
        // Abbreviate if len > 10
    }
}`,
    },
    "cf-1a-theatre-square": {
        PYTHON: `n, m, a = map(int, input().split())
# Calculate minimum flagstones
`,
        CPP: `#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n, m, a;
    cin >> n >> m >> a;
    // Calculate minimum flagstones
    return 0;
}`,
    },
    "cf-110a-nearly-lucky-number": {
        PYTHON: `n = input()
# Count lucky digits (4 and 7), check if count is lucky
`,
    },
    "cf-617a-elephant": {
        PYTHON: `x = int(input())
# Minimum steps (can move 1-5 at a time)
`,
    },
};

// Updated test cases with proper JSON format for LeetCode-style I/O
const TESTCASE_UPDATES: Record<string, { input: string; expectedOutput: string; isHidden: boolean }[]> = {
    "two-sum": [
        { input: "[2,7,11,15]\n9", expectedOutput: "[0,1]", isHidden: false },
        { input: "[3,2,4]\n6", expectedOutput: "[1,2]", isHidden: false },
        { input: "[3,3]\n6", expectedOutput: "[0,1]", isHidden: true },
        { input: "[1,5,8,3,9]\n11", expectedOutput: "[1,3]", isHidden: true },
    ],
    "best-time-to-buy-and-sell-stock": [
        { input: "[7,1,5,3,6,4]", expectedOutput: "5", isHidden: false },
        { input: "[7,6,4,3,1]", expectedOutput: "0", isHidden: false },
        { input: "[2,4,1]", expectedOutput: "2", isHidden: true },
        { input: "[1,2]", expectedOutput: "1", isHidden: true },
    ],
    "contains-duplicate": [
        { input: "[1,2,3,1]", expectedOutput: "true", isHidden: false },
        { input: "[1,2,3,4]", expectedOutput: "false", isHidden: false },
        { input: "[1,1,1,3,3,4,3,2,4,2]", expectedOutput: "true", isHidden: true },
    ],
    "maximum-subarray": [
        { input: "[-2,1,-3,4,-1,2,1,-5,4]", expectedOutput: "6", isHidden: false },
        { input: "[1]", expectedOutput: "1", isHidden: false },
        { input: "[5,4,-1,7,8]", expectedOutput: "23", isHidden: true },
        { input: "[-1]", expectedOutput: "-1", isHidden: true },
    ],
    "binary-search": [
        { input: "[-1,0,3,5,9,12]\n9", expectedOutput: "4", isHidden: false },
        { input: "[-1,0,3,5,9,12]\n2", expectedOutput: "-1", isHidden: false },
        { input: "[5]\n5", expectedOutput: "0", isHidden: true },
    ],
    "climbing-stairs": [
        { input: "2", expectedOutput: "2", isHidden: false },
        { input: "3", expectedOutput: "3", isHidden: false },
        { input: "5", expectedOutput: "8", isHidden: true },
        { input: "10", expectedOutput: "89", isHidden: true },
        { input: "45", expectedOutput: "1836311903", isHidden: true },
    ],
    "house-robber": [
        { input: "[1,2,3,1]", expectedOutput: "4", isHidden: false },
        { input: "[2,7,9,3,1]", expectedOutput: "12", isHidden: false },
        { input: "[2,1,1,2]", expectedOutput: "4", isHidden: true },
        { input: "[0]", expectedOutput: "0", isHidden: true },
    ],
    "container-with-most-water": [
        { input: "[1,8,6,2,5,4,8,3,7]", expectedOutput: "49", isHidden: false },
        { input: "[1,1]", expectedOutput: "1", isHidden: false },
        { input: "[4,3,2,1,4]", expectedOutput: "16", isHidden: true },
    ],
    "jump-game": [
        { input: "[2,3,1,1,4]", expectedOutput: "true", isHidden: false },
        { input: "[3,2,1,0,4]", expectedOutput: "false", isHidden: false },
        { input: "[0]", expectedOutput: "true", isHidden: true },
        { input: "[2,0,0]", expectedOutput: "true", isHidden: true },
    ],
};

async function main() {
    console.log("🔄 Updating boilerplate templates and test cases...\n");

    // Update boilerplates
    for (const [slug, boilerplate] of Object.entries(BOILERPLATE_UPDATES)) {
        const updated = await prisma.problem.updateMany({
            where: { slug },
            data: { boilerplate: boilerplate as any }
        });
        if (updated.count > 0) {
            console.log(`  ✅ Updated boilerplate for "${slug}"`);
        } else {
            console.log(`  ⚠️  Problem "${slug}" not found`);
        }
    }

    // Update test cases
    for (const [slug, testCases] of Object.entries(TESTCASE_UPDATES)) {
        const problem = await prisma.problem.findUnique({ where: { slug } });
        if (!problem) {
            console.log(`  ⚠️  Problem "${slug}" not found for test cases`);
            continue;
        }

        // Delete old test cases
        await prisma.testCase.deleteMany({ where: { problemId: problem.id } });

        // Create new ones
        for (let i = 0; i < testCases.length; i++) {
            await prisma.testCase.create({
                data: {
                    problemId: problem.id,
                    input: testCases[i].input,
                    expectedOutput: testCases[i].expectedOutput,
                    isHidden: testCases[i].isHidden,
                    isExample: !testCases[i].isHidden,
                    order: i,
                }
            });
        }
        console.log(`  ✅ Updated ${testCases.length} test cases for "${slug}"`);
    }

    console.log("\n🎉 All templates and test cases updated!");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
