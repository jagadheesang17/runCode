import { test } from "../customFixtures/expertusFixture"

test('Navigate to learner groups', async ({ adminHome }) => {
  await adminHome.loadAndLogin("CUSTOMERADMIN");
  await adminHome.menuButton();
  await adminHome.people();
  await adminHome.clickLearnerGroupLink();
});
