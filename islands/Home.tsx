import { FunctionComponent } from "preact";
import { useEffect, useState } from "preact/hooks";
import { Film, Project} from "../types.ts";
import { useSignal, Signal } from "@preact/signals";

import {BrandFilter, FormatFilter, NameFilter, ColorFilter, ISOFilter} from "../components/Filters.tsx";

const Home: FunctionComponent = () => {
    const [films, setFilms] = useState<Film[]>([]);
    const [brands, setBrands] = useState<string[]>([]);
    const [isos, setIsos] = useState<number[]>([]);
    const [filteredFilms, setFilteredFilms] = useState<Film[]>([]);
    const [showModalMain, setShowModalMain] = useState<boolean>(false);
    const [showModalNewProject, setShowModalNewProject] = useState<boolean>(false);
    const [showModalExistingProject, setShowModalExistingProject] = useState<boolean>(false);
    const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
    const [existingProjects, setExistingProjects] = useState<Project[]>([]);

    const brandSignal: Signal<string> = useSignal("any");
    const isoSignal: Signal<number> = useSignal(0);
    const formatThirtyFiveSignal: Signal<boolean> = useSignal(false);
    const formatOneTwentySignal: Signal<boolean> = useSignal(false);
    const colorSignal: Signal<boolean> = useSignal(false);
    const nameSignal: Signal<string> = useSignal("");

    useEffect(() => {
        const handler = async () => {
            const data = await fetch("/api/getFilms");
            const response: Film[] = await data.json();
            setFilms(response);

            const brands: string[] = response.map(film => film.brand);
            const uniqueBrands = Array.from(new Set(brands));
            uniqueBrands.sort();
            setBrands(uniqueBrands);

            const isos: number[] = response.map(film => film.iso);
            const uniqueIsos = Array.from(new Set(isos));
            uniqueIsos.sort((a, b) => a - b);
            setIsos(uniqueIsos);
        }

        handler();
    }, []);

    useEffect(() => {
        const filteredFilms = films.filter(film => {
            const matchesBrand = brandSignal.value === "any" || film.brand === brandSignal.value;
            const matchesIso = isoSignal.value === 0 || film.iso === isoSignal.value;
            const matchesFormat = (!formatThirtyFiveSignal.value && !formatOneTwentySignal.value) ||
                (formatThirtyFiveSignal.value && film.formatThirtyFive) ||
                (formatOneTwentySignal.value && film.formatOneTwenty);

            const matchesColor = !colorSignal.value || film.color;
            const matchesName = nameSignal.value === "" || film.name.toLowerCase().includes(nameSignal.value.toLowerCase());

            return matchesBrand && matchesIso && matchesFormat && matchesColor && matchesName;
        });

        setFilteredFilms(filteredFilms);
    }, [films, brandSignal.value, isoSignal.value, formatThirtyFiveSignal.value, formatOneTwentySignal.value, colorSignal.value, nameSignal.value]);

    const handleAddFilm = (film: Film) => {
        setSelectedFilm(film);
        setShowModalMain(true);
    };

    const handleCloseModalMain = () => {
        setShowModalMain(false);
        setSelectedFilm(null);
    };

    const handleAddFilmNewProject = () => {
        setShowModalMain(false);
        setShowModalNewProject(true);
    }

    const handleCloseModalNewProject = () => {
        setShowModalMain(true);
        setShowModalNewProject(false);
    }

    const handleSubmitNewProject = (event: Event) => {
        event.preventDefault();
    
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        const projectName = formData.get('name') as string;
    
        if (projectName && selectedFilm) {
            const newProject:Project = {
                name: projectName,
                films: [selectedFilm._id]
            };
            const cookie = document.cookie;

            const projectCookie = cookie.split(';').find(c => c.startsWith('projects'));

            if(projectCookie){ 
                if(JSON.parse(projectCookie.split('=')[1]).find((project: Project) => project.name === projectName)){
                    alert("Error: Already exists a project called like that!");
                    handleCloseModalNewProject();
                    return;
                }
                
                alert("Project created!");
                const projects = JSON.parse(projectCookie.split('=')[1]);
                projects.push(newProject);
                document.cookie = `projects=${JSON.stringify(projects)}; path=/`;
            }else{
                const projects: Project[] = [newProject];
                document.cookie = `projects=${JSON.stringify(projects)}; path=/`;
            }
    
            handleCloseModalNewProject();
        }
    };

    const handleAddFilmExistingProject = () => {
        setShowModalMain(false);
        setShowModalExistingProject(true);

        const cookie = document.cookie;

        const projectCookie = cookie.split(';').find(c => c.startsWith('projects'));

        if(projectCookie){
            const projects = JSON.parse(projectCookie.split('=')[1]);
            if(projects.length > 0){
                setExistingProjects(projects);
                return;
            }
        }
        alert("None projects found!");
        setShowModalMain(true);
        setShowModalExistingProject(false);
    }

    const handleCloseModalExistingProject = () => {
        setShowModalMain(true);
        setShowModalExistingProject(false);
    }

    const handleSubmitExistingProject = (event: Event) => {
        event.preventDefault();

        const form = event.target as HTMLFormElement;

        const formData = new FormData(form);

        const selectedProject = formData.get('project') as string;
        
        if(selectedProject && selectedFilm){
            const cookie = document.cookie;

            const projectCookie = cookie.split(';').find(c => c.startsWith('projects'));

            if(projectCookie){
                const projects = JSON.parse(projectCookie.split('=')[1]);

                const project = projects.find((project: Project) => project.name === selectedProject);

                if(project){
                    project.films.push(selectedFilm._id);
                    document.cookie = `projects=${JSON.stringify(projects)}; path=/`;
                }
            }
        }

        setShowModalMain(true);
        setShowModalExistingProject(false);
    }

    return (
        <div className="container">
            <div className="filters">
                <div className="filters-left">
                    <div className="search-container">
                        <NameFilter nameSignal={nameSignal} />
                    </div>
                    <div className="filters-containers">
                        <div className="select-container">
                            <BrandFilter brands={brands} brandSignal={brandSignal} />
                        </div>
                        <div className="select-container">
                            <ISOFilter isos={isos} isoSignal={isoSignal} />
                        </div>
                        <div className="select-container">
                            <FormatFilter formatOneTwentySignal={formatOneTwentySignal} formatThirtyFiveSignal={formatThirtyFiveSignal} />
                        </div>
                        <div className="select-container">
                            <ColorFilter colorSignal={colorSignal} />
                        </div>
                    </div>
                </div>
                <div className="projects-container">
                    <a href="/projects">Projects</a>
                </div>
            </div>
            <h1 className="message-results">{filteredFilms.length} Results found</h1>
            <div className="films">
                {filteredFilms.map(film => (  
                    <li class="container-film" key={film._id}>
                        <a href={`/film/${film._id}`}>
                            <img class= "film-img" src={film.staticImageUrl}/>
                            <h2>{film.name}</h2>
                        </a>
                        <button onClick={() => handleAddFilm(film)}>Add to a project</button>
                    </li>
                ))}
            </div>
            {showModalMain && selectedFilm && (
                <div className="modal">
                    <div className="modal-content">
                        <button onClick={handleAddFilmNewProject}>Add to a new project</button>
                        <br/>
                        <button onClick={handleAddFilmExistingProject}>Add to an existing project</button>
                        <br/>
                        <button onClick={handleCloseModalMain}>Close</button>
                    </div>
                </div>
            )}
            {showModalNewProject && (
                <div className="modal">
                    <div className="modal-content">
                        <div>
                            <form onSubmit={handleSubmitNewProject}>
                                <input type="text" placeholder="project-name" name = "name"/>
                                <br/>
                                <button type="submit">Add</button>
                            </form>
                            <button onClick={handleCloseModalNewProject}>Close</button>
                        </div>
                    </div>
                </div>
            )}
            {showModalExistingProject && (
                <div className="modal">
                    <div className="modal-content">
                        <div>
                            <form onSubmit={handleSubmitExistingProject}>
                                <label>Chooose a project</label>
                                <br/>
                                <select name="project">
                                    {existingProjects.map(project => (
                                        <option value={project.name}>{project.name}</option>
                                    ))}
                                </select>
                                <br/>
                                <button type="submit">Add</button>
                            </form>
                            <button onClick={handleCloseModalExistingProject}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
