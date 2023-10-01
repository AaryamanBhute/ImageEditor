import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getCsrfToken } from "next-auth/react"

export default async function getServerSideProps(context: GetServerSidePropsContext) {
    return {
      props: {
        csrfToken: await getCsrfToken(context),
      },
    }
  }