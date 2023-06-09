import { Flex, Input } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import React from 'react';

type SearchProps = {};

const Search: React.FC<SearchProps> = () => {
  return (
    <Flex sx={{ flexGrow: 1 }}>
      <Input
        icon={<IconSearch />}
        placeholder="Search NoteRep Forum"
        w={{ base: 'min-content', xs: '100%' }}
        mx="1rem"
      />
    </Flex>
  );
};
export default Search;
