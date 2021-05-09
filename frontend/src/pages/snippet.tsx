/* eslint-disable no-console */
import * as React from 'react';

import { AxiosResponse } from 'axios';

import { RouteComponentProps } from 'react-router';
import { Button, useMediaQuery } from '@chakra-ui/react';

import SnippetCard from '../components/snippet/card';
import SnippetCrud from '../components/snippet/crud';
import { DeleteModal } from '../components/modals/delete-snippet';

import { getSnippet } from '../services/get.service';
import { getRequest } from '../services/crud.service';

import { useDataHandler } from '../context/datahandler.context';
import { useUserContext } from '../context/user.context';

import { Secondary } from '../containers/secondary.container';
import { Content } from '../connectors/main';
import { SideNav } from '../connectors/side';
import { HeaderBox } from '../connectors/header-box';
import { GoBackButton } from '../components/shared/brand-button';

interface SnippetPageProps
  extends RouteComponentProps<{ id: string }> {}

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
const Snippet: React.FC<SnippetPageProps> = ({ match }) => {
  const {
    title,
    setTitle,
    value,
    setValue,
    description,
    setDescription,
    language,
    setLanguage,
    tags,
    setTags,
    source,
    setSource,
    privatize,
    setPrivatize,
    id,
    setId,
    editing,
    setEditing,
    submitting,
    setSubmitting,
    deleting,
    setDeleting,
    alert,
    setAlert,
    heading,
    setHeading,
    clearValues,
    faveSnippet,
    setFaveSnippet,
    handleFave,
    handleDelete,
    handleCancel,
    handleSubmit,
  } = useDataHandler();
  const { accessToken, username } = useUserContext();
  const [baseLg] = useMediaQuery('(min-width: 62em)');

  // const cancelRef = React.useRef<HTMLButtonElement>(null);

  // const closeAlert = () => setAlert(false);

  const [snippet, setSnippet] = React.useState<Snippet | undefined>();
  const [loading, setLoading] = React.useState(false);

  const loadSnippet = async (snippetId: string) => {
    setLoading(true);
    const data = await getRequest({
      url: `api/snippets/${snippetId}`,
      accessToken,
    });
    if (data) {
      setSnippet(data[0]);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (match.params.id !== 'add') {
      setEditing(true);
      loadSnippet(match.params.id);
    } else {
      setEditing(false);
      clearValues();
    }
  }, [match.params.id]);

  React.useEffect(() => {
    if (snippet) {
      setId(snippet._id);
      setHeading(`Editing ${snippet.title}`);
      setTitle(snippet.title);
      setValue(snippet.value);
      setDescription(snippet.description);
      setLanguage(snippet.language);
      setTags(snippet.tags.join(', '));
      setPrivatize(snippet.private === false ? '' : 'On');
      snippet.source && setSource(snippet.source);
    }
  }, [snippet]);

  return (
    <>
      <Secondary>
        <HeaderBox left heading={id} />
        <SideNav>
          <SnippetCrud
            snippet={snippet}
            editing={editing}
            setAlert={setAlert}
            title={title}
            setTitle={setTitle}
            language={language}
            setLanguage={setLanguage}
            value={value}
            setValue={setValue}
            description={description}
            setDescription={setDescription}
            tags={tags}
            setTags={setTags}
            source={source}
            setSource={setSource}
            privatize={privatize}
            setPrivatize={setPrivatize}
            submitting={submitting}
            deleting={deleting}
            handleSubmit={handleSubmit}
            handleDelete={handleDelete}
            handleCancel={handleCancel}
          />
        </SideNav>
      </Secondary>
      <DeleteModal alert={alert} setAlert={setAlert} title={title} />
      <Content>
        <HeaderBox heading={heading}>
          <GoBackButton>Go Back</GoBackButton>
        </HeaderBox>

        {!baseLg && (
          <SnippetCrud
            snippet={snippet}
            editing={editing}
            setAlert={setAlert}
            title={title}
            setTitle={setTitle}
            language={language}
            setLanguage={setLanguage}
            value={value}
            setValue={setValue}
            description={description}
            setDescription={setDescription}
            tags={tags}
            setTags={setTags}
            source={source}
            setSource={setSource}
            privatize={privatize}
            setPrivatize={setPrivatize}
            submitting={submitting}
            deleting={deleting}
            handleSubmit={handleSubmit}
            handleDelete={handleDelete}
            handleCancel={handleCancel}
          />
        )}
        {loading ? (
          <p>Loading..</p>
        ) : (
          <SnippetCard
            editing={editing}
            snippet={snippet}
            loading={loading}
            title={title}
            language={language}
            value={value}
            description={description}
            tags={tags}
            source={source}
            id={id}
            setTags={setTags}
            handleFave={handleFave}
            faveSnippet={faveSnippet}
          />
        )}
      </Content>
    </>
  );
};

export default Snippet;
