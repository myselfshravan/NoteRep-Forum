import { Accordion, Box, Card, Title, useMantineColorScheme } from '@mantine/core';
import React from 'react';
import { CommunityProps } from '../../redux/slices/communitySlice';

interface RulesProps {
  communityInfo: CommunityProps;
}

const Rules: React.FC<RulesProps> = ({ communityInfo }) => {
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
  const rules = [
    {
      title: '1.Stay on-topic',
      body: 'Keep discussions relevant to college life. This includes topics such as: study tips, exam advice, course recommendations, and more.',
    },
    {
      title: "2.Respect others' views",
      body: 'Be respectful of others. This includes not posting content that is offensive, hateful, or discriminatory.',
    },
    {
      title: '3.Learn and enjoy',
      body: "Don't be afraid to ask questions. This is a community for learning and sharing knowledge.",
    },
  ];
  return (
    <Box>
      <Card bg={dark ? 'dark' : 'gray.0'} withBorder>
        <Title order={5}>{`f/${communityInfo.id} Rules`}</Title>
        <Accordion defaultValue="rules">
          {rules.map((rule) => (
            <Accordion.Item value={rule.title} key={rule.title}>
              <Accordion.Control>{rule.title}</Accordion.Control>
              <Accordion.Panel>{rule.body}</Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </Card>
    </Box>
  );
};
export default Rules;
