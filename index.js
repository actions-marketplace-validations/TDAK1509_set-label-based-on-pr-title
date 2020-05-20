const core = require("@actions/core");
const github = require("@actions/github");

try {
  const contextPullRequest = github.context.payload.pull_request;
  if (!contextPullRequest) {
    throw new Error(
      "This action can only be invoked in `pull_request` events. Otherwise the pull request can't be inferred."
    );
  }

  const prTitle = contextPullRequest.title;
  const prNumber = contextPullRequest.number;

  const patternToCheck = core.getInput("pattern");

  const labelToAdd = core.getInput("label");
  const labels = [labelToAdd];

  const repoToken = core.getInput("repo-token");
  const octokit = new github.GitHub(repoToken);

  if (prTitle.includes(patternToCheck)) {
    octokit.issues.addLabels({
      ...github.context.repo,
      issue_number: prNumber,
      labels,
    });
  }
} catch (error) {
  core.setFailed(error.message);
}
