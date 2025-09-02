import Head from "next/head";
interface Props {
  title?: string;
}
const PageHead = (props: Props) => {
  const { title = "Prima" } = props;

  return (
    <Head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="shortcut icon" href="/images/logo-prima.png" type="image/x-icon" />
      <title>{title}</title>
    </Head>
  );
};

export default PageHead;
