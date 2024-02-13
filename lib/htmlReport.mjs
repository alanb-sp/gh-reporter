//Generate HTML table, accepts PRs and title
function generateTable(prs, title) {
  let table = `<tr>
  <th style="width: 40%; text-align: center">title</th>
  <th style="width: 10%; text-align: left">user</th>
  <th style="width: 10%; text-align: left">labels</th>
  <th style="width: 15%; text-align: left">created at</th>
  <th style="width: 10%; text-align: left">comments</th>
</tr>`;
  prs.forEach(element => {
    let labels = '';
    element.labels.forEach(label => {
      labels = labels + label.name;
    });
    const tableElement = `
      <tr>
      <td style="text-align: center"><a href="${element.html_url}">${element.title}</a></td>
      <td><a href="${element.user.html_url}">${element.user.login}</a></td>
      <td>${labels}</td>
      <td>${new Date(element.created_at).toLocaleString('en-US', { timeZoneName: 'short' })}</td>
      <td>${element.comments}</td>
      </tr>
    `
    table = table + tableElement;
  });

  table = '<table cellpadding="4em" cellspacing="0" style="padding-top: 3em;"> <caption style="padding-top: 3em;">' + title + '</caption>' + table + '</table>'
  return table;
}

//Generate HTML formated report, accepts the organization, repo, date since the PR's are filtered, and PR's.
function htmlReport(organization, repo, reportDate, prsnew, prsopen, prsclosed) {
  const newPrsCount = prsnew.length;
  const closedPrsCount = prsclosed.length;
  const openPrsCount = prsopen.length;

  let body = '';

  const reportHeader = `
  <h2> This is the PR activity report for ${organization}/${repo} since ${reportDate.toString()}</h2>
  <div style="padding: 2em; padding-left: 4em;">
  <p>repository: <a href="https://github.com/${organization}/${repo}" >${organization}/${repo}</a></p>
  <p>New PR's Opened: ${newPrsCount}</p>
  <p>Closed PR's: ${closedPrsCount}</p>
  <p>In Progress PR's: ${openPrsCount}</p>
  </div>`;

  const openTable = generateTable(prsopen, 'List of currently Open Pull Requests');
  const closedTable = generateTable(prsclosed, 'List of closed Pull Requests');

  body = '<body style="font-family: Oxygen, sans-serif;">' + reportHeader + openTable + '<br></br>' + closedTable + '</body>'

  // console.log(body);
  return '<!DOCTYPE html>'
    + '<html><body>' + body + '</body></html>';
}

export { htmlReport };
