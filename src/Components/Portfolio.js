import React, { Component } from 'react';
import Project from './Project';
import './Project.css';

class Portfolio extends Component {  

  render() {

    if(this.props.data) {
      var description = this.props.data.description;
      console.log(description);

      var project = this.props.data.projects.map(
        (item) => {
          return (<Project data={item}/>)
        }
      );
    }
    
    return (

      <section id="portfolio">
        <div className="row">
          <div className="three columns header-col">
              {/* <h1><span>Projects</span></h1> */}
          </div>

          <div className="twelve columns collapsed">
              <h1 className="project-header">Projects!</h1>
              <p className="project-description">
                Over the last two years, I have been proud about my contributions and achievements for these key projects.<br></br> <br></br>  
                To summarize.....<br></br> 
                - I worked with the Red Hat's Ansible Team as an intern,
                Ansible - an IaaS open source tool widely used by many organizations in the world<br></br> 
                - I had worked as a freelance consultant developing an in-house application for automating a workflow used by approximately 50 employees<br></br> 
                - While working as a Teaching Assistant during my Masters, I transitioned the traditional approach of manual grading to automated grading<br></br> 
                <br></br> 
                The source code & samples can be viewed by clicking the links mentioned below!
              </p>

              <div className="project-container">
                  {project}             
              </div>
              <h1 className="more-projects"><a href="https://www.github.com/adityamulik?tab=repositories">View more projects by clicking here!</a></h1>
          </div>
        </div>
      </section>
    );
  }
}

export default Portfolio;
