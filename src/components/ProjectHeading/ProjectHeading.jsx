import './ProjectHeading.css';

export const ProjectHeading = () => {
    return <section className="project-heading">
        <h1 className="project-heading__title">UI Design</h1>
        <div className="project-heading__date">
            <span className="project-heading__date-label">Created on: </span>
            <span className="project-heading__date-value">Feb 19, 2022</span>
        </div>
    </section>
}