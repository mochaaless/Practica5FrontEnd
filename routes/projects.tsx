import { Film, Project } from "../types.ts";
import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";

type Data = {
    projects: ProjectsArr[]
}

type ProjectsArr = {
    name: string,
    films: Film[],
}

export const handler:Handlers = {
    GET: async (req: Request, ctx:FreshContext<unknown, Data>) => {
        const cookies = getCookies(req.headers);
        const projects:Project[] = JSON.parse(cookies.projects);
        const response = await fetch("https://filmapi.vercel.app/api/films");
        const films: Film[] = await response.json();

        const resolvedProjects= projects.map((project: Project) => {
            const projectFilms = films.filter(film => project.films.includes(film._id));

            return {
                name: project.name,
                films: projectFilms,
            }
        })

        const resolvedProjectsResponse = await Promise.all(resolvedProjects);
        return ctx.render({projects: resolvedProjectsResponse});
    }
}

const Page = (props: PageProps<Data>) => {
    const { data } = props;
    const projects = data.projects;

    return(
        <div className="projects-container"> 
            <a href = "/" className="home-button">Home</a>
            <h1>Projects:</h1>
            {projects.map(project => (
                <div className="project"> 
                    <h2 className="project-name">{project.name}</h2>
                    <ul className="project-films"> 
                        {project.films.map(film => (
                            <li class="container-film" key={film._id}>
                                <a href={`/film/${film._id}`}>
                                    <img class= "film-img" src={film.staticImageUrl}/>
                                    <h2>{film.name}</h2>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    )
}

export default Page;