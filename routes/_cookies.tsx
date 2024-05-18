import { FreshContext, Handlers } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";

export const handler = async(req: Request, ctx: FreshContext) => {
    if (ctx.route === "/projects") {
        const cookies = getCookies(req.headers);
        const projectsCookie = cookies.projects;
  
        if (!projectsCookie) {
          return new Response("", {
            status: 302,
            headers: {
              location: "/error"
            }
          });
        }
  
        try {
          const projects = JSON.parse(projectsCookie);
          if (!projects || projects.length === 0) {
            return new Response("", {
              status: 302,
              headers: {
                location: "/error"
              }
            });
          }
        } catch (error) {
          return new Response("", {
            status: 500,
            headers: {
              location: "/error"
            }
          });
        }
      }
      return await ctx.next();
}