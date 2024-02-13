import { Octokit } from "@octokit/rest";
import { htmlReport } from "./lib/htmlReport.mjs";
import { sendEmail } from "./lib/emailSender.mjs";
import fs from 'fs';


const handler = async (event) => {
    let octokit = {};

    if (process.env.gh_token) {
        const auth_token = process.env.gh_token;
        octokit = new Octokit({ auth: auth_token });
        const {
            data: { login },
        } = await octokit.rest.users.getAuthenticated();
        console.log("Authenticated as: %s", login);
    }
    else {
        octokit = new Octokit(); // for public repos
    }

    const organization = process.env.ghOrganization;
    const repository = process.env.ghRepository;
    const reportdays = process.env.reportDays || 7;

    let days = new Date();
    days.setDate(days.getDate() - Number(reportdays));


    const pullquestsOpen = await queryPRs(`type:pr+is:open+repo:${organization}/${repository}`, octokit);
    const pullquestsClosed = await queryPRs(`type:pr+is:closed+repo:${organization}/${repository}+closed:>=` + days.toISOString().slice(0, 10), octokit);
    const pullquestsCreated = await queryPRs(`type:pr+repo:${organization}/${repository}+created:>=` + days.toISOString().slice(0, 10), octokit);

    const emailSubject = 'PR report for repo:  ' + repository;

    // console.log(htmlReport(organization, repository, days, pullquestsCreated, pullquestsOpen, pullquestsClosed));
    try {
        const emailHTML = htmlReport(organization, repository, days, pullquestsCreated, pullquestsOpen, pullquestsClosed);
        if (process.env.htmlFile) fs.writeFile(process.env.htmlFile, emailHTML, (err) => {
            if (err) console.error(err);
        });
        if (process.env.emailPass) sendEmail(emailSubject, emailHTML);
        console.log('Repository: %s/%s', organization, repository);
        console.log('Email to: ', process.env.emailTo);
        console.log('Email from: ', process.env.emailFrom);
        console.log('Email HTML body: \n', emailHTML);

        return {
            statusCode: 200,
            body: JSON.stringify('Report sent.'),
        };
    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify('Error Sending report. please check logs.'),
        };

    }
};

async function queryPRs(query, octokit) {
    const pullquests = [];
    for await (const { data: prs } of octokit.paginate.iterator(
        octokit.rest.search.issuesAndPullRequests,
        {
            q: query,
            per_page: 100,
        }
    )) {
        pullquests.push(...prs);
    }
    return pullquests;
}

export { handler };
