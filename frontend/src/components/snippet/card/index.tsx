import * as React from 'react';

import { useHistory } from 'react-router';

import {
  Flex,
  Box,
  useMediaQuery,
  useBoolean,
  useClipboard,
  useColorModeValue as mode,
} from '@chakra-ui/react';

import { AnimatePresence, motion } from 'framer-motion';

import { useUserContext } from '../../../context/user.context';

import { Viewer } from '../editor/viewer';

import {
  MotionSection,
  MotionBox,
  MotionFooter,
} from '../../shared/motion-box';

import {
  Description,
  TagList,
  TagMenu,
  PostUserData,
  PostFaveData,
  SourceButton,
  EditButton,
  FaveButton,
  ViewerControls,
  CopyButton,
} from '../body/elements';

import { collection } from '../../../constants/colors.constants';

const MotionArticle = motion(Box);

/**
 * Frontend private endpoint that represents a single code snippet post.
 * Selected by `_id`.
 * CRUD operations begin from this component tree.
 * @file defines route for one unique Snippet.
 * @date 2021-04-21
 * @param {any} match
 * @param {any} history
 * @return {=>}
 */
const SnippetCard: React.FC<{
  setTags: React.Dispatch<React.SetStateAction<string>>;
  handleFave: (snipId: string) => Promise<void>;
  faveSnippet: boolean;
  snippet: Snippet | undefined;
  editing: boolean;
  loading: boolean;
  title: string;
  language: string;
  value: string;
  description: string;
  tags: string;
  source: string;
  id: string;
}> = ({
  setTags,
  handleFave,
  faveSnippet,
  snippet,
  editing,
  loading,
  title,
  language,
  value,
  description,
  tags,
  source,
  id,
}) => {
  const { accessToken, username } = useUserContext();
  const [baseLg] = useMediaQuery('(min-width: 62em)');
  const history = useHistory();
  const { hasCopied, onCopy } = useClipboard(value);

  const [lineNumbers, setLineNumbers] = useBoolean();
  const [wrapLines, setWrapLines] = useBoolean();

  return (
    <>
      <AnimatePresence exitBeforeEnter>
        {!loading && (
          <MotionArticle
            bg={mode('#fff', '#141625')}
            as="article"
            borderWidth="1px"
            borderRadius="lg"
            border={['1px solid']}
            borderColor={mode('#bbb', '#7e88c3')}
            overflow="hidden"
            mx="auto"
            my={6}
            width="100%"
            p={['10px']}
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: '0' },
            }}
            transition={{
              duration: 0.5,
              ease: [0.04, 0.62, 0.23, 0.98],
            }}
            positionTransition
          >
            <Flex
              bg={mode('#f6f6f6', '#252945')}
              as="header"
              height="50px"
              borderRadius="6px"
              alignItems="center"
              padding="20px"
              justifyContent="space-between"
              _hover={{
                bg: mode('#f6f6f6', '#252945'),
              }}
              cursor="default"
            >
              <h2>{title}</h2>

              <h3>{language}</h3>
            </Flex>

            <>
              <MotionSection
                pt="6px"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.3,
                  ease: [0.04, 0.62, 0.23, 0.98],
                }}
              >
                <MotionBox ml="-10px" mr="-10px">
                  {editing && (
                    <ViewerControls
                      value={value}
                      lineNumbers={lineNumbers}
                      wrapLines={wrapLines}
                      setWrapLines={setWrapLines}
                      setLineNumbers={setLineNumbers}
                    />
                  )}
                  <CopyButton value={value} />

                  <Viewer
                    id={id}
                    value={value}
                    language={language}
                    wrapLongLines={!baseLg ? true : wrapLines}
                    showLineNumbers={lineNumbers}
                  />
                </MotionBox>

                <Description description={description} />
              </MotionSection>
              <MotionFooter p={2}>
                <Flex spacing={4}>
                  <Box flex="1" display="flex">
                    <TagList
                      tags={tags.split(', ')}
                      editing={editing}
                      setTags={setTags}
                    />
                    {!editing && tags.split(', ').length > 3 && (
                      <TagMenu
                        collections
                        tags={tags.split(', ')}
                        editing={editing}
                        setTags={setTags}
                      />
                    )}
                  </Box>

                  <Box display="flex">
                    {!editing && snippet && (
                      <PostUserData
                        username={username}
                        addedBy={snippet.addedBy}
                        addedOn={snippet.addedOn}
                      />
                    )}
                    {!editing &&
                      snippet &&
                      snippet.likedBy.length > 0 && (
                        <PostFaveData likedBy={snippet.likedBy} />
                      )}
                  </Box>

                  <Box display="flex" spacing={1} ml="8px">
                    {source && <SourceButton source={source} />}
                    {!editing &&
                    snippet &&
                    snippet.addedBy === username ? (
                      <EditButton snipId={snippet._id} />
                    ) : (
                      !editing &&
                      snippet &&
                      username && (
                        <FaveButton
                          username={username}
                          snipId={snippet._id}
                          likedBy={snippet.likedBy}
                          faveSnippet={faveSnippet}
                          handleFave={handleFave}
                        />
                      )
                    )}
                  </Box>
                </Flex>
              </MotionFooter>
            </>
          </MotionArticle>
        )}
      </AnimatePresence>
    </>
  );
};

export default SnippetCard;
