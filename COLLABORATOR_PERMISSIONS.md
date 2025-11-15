# GitHub Collaborator Permissions Guide

This guide explains how to give GitHub collaborators permission to change repository settings.

## Overview

GitHub provides different permission levels for repository collaborators. To give collaborators the ability to change repository settings, they need **Admin** access to the repository.

## Permission Levels on GitHub

GitHub offers five permission levels for repository collaborators:

1. **Read**: Can view and clone the repository
2. **Triage**: Can manage issues and pull requests without write access
3. **Write**: Can push to the repository and manage issues/PRs
4. **Maintain**: Can manage the repository without access to sensitive or destructive actions
5. **Admin**: Full access including repository settings, managing collaborators, and destructive actions

## Settings Access Requirements

To change repository settings, collaborators need **Admin** permission. With Admin access, collaborators can:

- Modify repository settings (description, website, topics, etc.)
- Manage repository features (Wikis, Issues, Projects, etc.)
- Configure branch protection rules
- Manage webhooks and integrations
- Add/remove collaborators
- Transfer or delete the repository
- Configure security and analysis features

## How to Grant Admin Access to Collaborators

### Step 1: Navigate to Repository Settings

1. Go to your repository on GitHub: `https://github.com/SebaFulger/HouseGig`
2. Click on the **Settings** tab (you must be a repository owner or admin to see this)

### Step 2: Access Collaborators Section

1. In the left sidebar, click on **Collaborators and teams** (or **Collaborators** for personal repositories)
2. You may be asked to confirm your GitHub password for security

### Step 3: Add or Modify Collaborators

#### To Add a New Collaborator:

1. Click the **Add people** button
2. Enter the GitHub username or email of the person you want to add
3. Select their username from the search results
4. In the role dropdown, select **Admin**
5. Click **Add [username] to this repository**

#### To Modify Existing Collaborator Permissions:

1. Find the collaborator in the list
2. Click on their current role (e.g., "Write")
3. Select **Admin** from the dropdown menu
4. The change takes effect immediately

### Step 4: Confirm the Change

The collaborator will receive an invitation email if they're newly added. Once they accept (or immediately if they were already a collaborator), they will have admin access to change repository settings.

## Best Practices

### 1. Principle of Least Privilege
Only grant Admin access to collaborators who genuinely need to manage repository settings. For most contributors:
- **Write** access is sufficient for committing code
- **Maintain** access is good for team leads who need some management capabilities
- Reserve **Admin** for trusted maintainers

### 2. Regular Access Review
- Periodically review who has Admin access
- Remove Admin permissions from collaborators who no longer need them
- Remove collaborators who are no longer active on the project

### 3. Use Teams for Organizations
If this repository is part of a GitHub Organization:
- Create teams with specific permission levels
- Assign collaborators to teams rather than individually
- This makes it easier to manage permissions at scale

### 4. Document Your Decisions
- Keep track of why certain collaborators have Admin access
- Document any special permission arrangements
- Consider creating a CODEOWNERS file for code review requirements

## Verification

After granting Admin access, the collaborator can verify their permissions by:

1. Navigating to the repository
2. Checking if they can see the **Settings** tab
3. Attempting to access repository settings

If they can see and modify repository settings, the permissions have been successfully granted.

## Troubleshooting

### Collaborator Can't See Settings Tab

**Possible causes:**
- They haven't accepted the collaboration invitation yet
- Their permission level is below Admin
- They're viewing the repository while not signed in
- There's a GitHub organization policy restricting access

**Solutions:**
1. Check their invitation status in Settings > Collaborators
2. Verify their permission level is set to Admin
3. Ensure they're signed in with the correct GitHub account
4. Check organization permissions if applicable

### Can't Add Collaborators

**Possible causes:**
- You don't have Admin access yourself
- The repository has reached its collaborator limit (private repos on free plans)
- GitHub organization policies restrict adding collaborators

**Solutions:**
1. Contact the repository owner to grant you Admin access
2. Upgrade the repository or GitHub plan if needed
3. Check with organization admins about collaboration policies

## Additional Resources

- [GitHub Docs: Repository permission levels](https://docs.github.com/en/organizations/managing-access-to-your-organizations-repositories/repository-permission-levels-for-an-organization)
- [GitHub Docs: Inviting collaborators](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-access-to-your-personal-repositories/inviting-collaborators-to-a-personal-repository)
- [GitHub Docs: Managing teams and people](https://docs.github.com/en/organizations/organizing-members-into-teams)

## Summary

To give GitHub collaborators permission to change repository settings:

1. ✅ Navigate to Repository Settings → Collaborators and teams
2. ✅ Add new collaborators or find existing ones
3. ✅ Set their role to **Admin**
4. ✅ Confirm they can access the Settings tab
5. ✅ Follow best practices for security and access management

Remember: Only grant Admin access to trusted collaborators who need to manage repository settings. For most contributors, Write or Maintain access is sufficient.
