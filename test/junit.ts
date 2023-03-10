import * as chai from "chai"
import { expect } from "chai"

import { TestStatus, parseJunitFile } from "../src/test_parser"

const resourcePath = `${__dirname}/resources/junit`

describe("junit", async () => {
    it("parses common", async () => {
        const result = await parseJunitFile(`${resourcePath}/01-common.xml`)

        expect(result.counts.passed).to.eql(7)
        expect(result.counts.failed).to.eql(1)
        expect(result.counts.skipped).to.eql(0)

        expect(result.suites.length).to.eql(2)
        expect(result.suites[0].cases.length).to.eql(2)
        expect(result.suites[1].cases.length).to.eql(6)
    })

    it("parses example", async () => {
        const result = await parseJunitFile(`${resourcePath}/02-example.xml`)

        expect(result.counts.passed).to.eql(21)
        expect(result.counts.failed).to.eql(9)
        expect(result.counts.skipped).to.eql(0)

        expect(result.suites.length).to.eql(5)

        expect(result.suites[0].name).to.eql("Validation")
        expect(result.suites[0].timestamp).to.eql('2022-03-07T01:42:21')
        expect(result.suites[0].filename).to.eql('/Users/ethomson/Projects/calculator/test/arithmetic.js')

        expect(result.suites[0].cases.length).to.eql(6)
        expect(result.suites[0].cases[0].status).to.eql(TestStatus.Pass)
        expect(result.suites[0].cases[0].name).to.eql("Arithmetic Validation rejects missing operation")
        expect(result.suites[0].cases[0].duration).to.eql("0.021")
        expect(result.suites[0].cases[0].description).to.eql("rejects missing operation")

        // ...

        expect(result.suites[0].cases[5].name).to.eql("Arithmetic Validation rejects operands with invalid decimals")
        expect(result.suites[0].cases[5].duration).to.eql("0.002")
        expect(result.suites[0].cases[5].description).to.eql("rejects operands with invalid decimals")

        expect(result.suites[1].name).to.eql("Addition")
        expect(result.suites[1].timestamp).to.eql('2022-03-07T01:42:21')
        expect(result.suites[1].filename).to.eql('/Users/ethomson/Projects/calculator/test/arithmetic.js')

        expect(result.suites[2].name).to.eql("Subtraction")
        expect(result.suites[2].timestamp).to.eql('2022-03-07T01:42:21')
        expect(result.suites[2].filename).to.eql('/Users/ethomson/Projects/calculator/test/arithmetic.js')

        expect(result.suites[3].name).to.eql("Multiplication")
        expect(result.suites[3].timestamp).to.eql('2022-03-07T01:42:21')
        expect(result.suites[3].filename).to.eql('/Users/ethomson/Projects/calculator/test/arithmetic.js')

        expect(result.suites[4].name).to.eql("Division")
        expect(result.suites[4].timestamp).to.eql('2022-03-07T01:42:41')
        expect(result.suites[4].filename).to.eql('/Users/ethomson/Projects/calculator/test/arithmetic.js')

        expect(result.suites[4].cases.length).to.eql(7)
        expect(result.suites[4].cases[0].status).to.eql(TestStatus.Fail)
        expect(result.suites[4].cases[0].name).to.eql("Arithmetic Division divides a positive integer by an integer factor ")
        expect(result.suites[4].cases[0].duration).to.eql("10")
        expect(result.suites[4].cases[0].description).to.eql("divides a positive integer by an integer factor ")
        expect(result.suites[4].cases[0].details!.substring(0, 35)).to.eql("Error: Timeout of 10000ms exceeded.")
    })

    it("parses junit", async () => {
        const result = await parseJunitFile(`${resourcePath}/03-junit.xml`)

        expect(result.counts.passed).to.eql(4)
        expect(result.counts.failed).to.eql(6)
        expect(result.counts.skipped).to.eql(2)

        expect(result.suites.length).to.eql(1)

        expect(result.suites[0].cases[0].name).to.eql("passesTestOne")
        expect(result.suites[0].cases[1].name).to.eql("passesTestTwo")
        expect(result.suites[0].cases[2].name).to.eql("passesTestThree")
        expect(result.suites[0].cases[3].name).to.eql("passesTestFour")
        expect(result.suites[0].cases[4].name).to.eql("failsTestFive")
        expect(result.suites[0].cases[5].name).to.eql("failsTestSix")
        expect(result.suites[0].cases[6].name).to.eql("failsTestSeven")
        expect(result.suites[0].cases[7].name).to.eql("failsTestEight")
        expect(result.suites[0].cases[8].name).to.eql("skipsTestNine")
        expect(result.suites[0].cases[9].name).to.eql("skipsTestTen")

        const ten = result.suites[0].cases[10]
        expect(ten.name).to.eql("Verify policy Apache Struts: CVE-2017-5638 is triggered")
        expect(ten.status).to.eql(TestStatus.Fail)
        expect(ten.duration).to.eql("264.996")
        expect(ten.description).to.eql("DefaultPoliciesTest")
        expect(ten.details!.substring(0, 25)).to.eql("Condition not satisfied:\n")
        expect(ten.stdout!.substring(0, 25)).to.eql("?[1;30m21:35:15?[0;39m | ")
        expect(ten.stderr).to.eql("")


        const eleven = result.suites[0].cases[11]
        expect(eleven.name).to.eql("TestTimeout")
        expect(eleven.status).to.eql(TestStatus.Fail)
        expect(eleven.duration).to.eql("0.000")
        expect(eleven.description).to.eql("command-line-arguments")
        expect(eleven.details!.substring(0, 21)).to.eql("panic: test timed out")
        expect(eleven.message!.substring(0, 21)).to.eql("No test result found")
    })

    it("parses bazel", async() => {
        // Not a perfect example of Bazel JUnit output - it typically does one file
        // per test target, and aggregates all the test cases from the test tooling
        // into one Junit testsuite / testcase. This does depend on the actual
        // test platform; my experience is mostly with py_test() targets.
        const result = await parseJunitFile(`${resourcePath}/04-bazel-junit.xml`)

        expect(result.counts.passed).to.eql(1)
        expect(result.counts.failed).to.eql(1)
        expect(result.counts.skipped).to.eql(0)

        expect(result.suites.length).to.eql(2)

        expect(result.suites[0].cases[0].name).to.eql("dummy/path/to/project/and/failing_test_target")
        expect(result.suites[0].cases[0].status).to.eql(TestStatus.Fail)
        expect(result.suites[1].cases[0].name).to.eql("dummy/path/to/project/and/passing_test_target")
        expect(result.suites[1].cases[0].status).to.eql(TestStatus.Pass)
    })

    it("parses empty testsuites", async () => {
        const result = await parseJunitFile(`${resourcePath}/05-empty.xml`)

        expect(result.counts.passed).to.eql(0)
        expect(result.counts.failed).to.eql(0)
        expect(result.counts.skipped).to.eql(0)
        expect(result.suites.length).to.eql(0)
    })

    it("parses empty testsuite", async () => {
        const result = await parseJunitFile(`${resourcePath}/06-empty.xml`)

        expect(result.counts.passed).to.eql(0)
        expect(result.counts.failed).to.eql(0)
        expect(result.counts.skipped).to.eql(0)
        expect(result.suites.length).to.eql(0)
    })
})
