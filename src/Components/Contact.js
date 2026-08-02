import React, { Component } from 'react';

class Contact extends Component {

   constructor(props) {
      super(props);
      this.state = {
         name: '',
         email: '',
         messageText: '',
         nameValid: false,
         emailValid: false,
         patternValid: false,
         messageValid: false,
         disabled: true
      }
      this.handleNameChange = this.handleNameChange.bind(this);
      this.handleEmailChange = this.handleEmailChange.bind(this);
      this.handleMessageChange = this.handleMessageChange.bind(this);
   }

   handleNameChange(e) {
      let nameValid = e.target.value ? true : false;
      let submitValid = this.state.emailValid && this.state.patternValid && this.state.messageValid && nameValid
      this.setState({
         name: e.target.value,
         nameValid: nameValid,
         disabled: !submitValid
      });
   }

   handleEmailChange(e) {
      const pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
      let patternValid = pattern.test(e.target.value) ? true : false;
      let emailValid = e.target.value ? true : false;
      let submitValid = this.state.nameValid && this.state.messageValid && emailValid && patternValid
      this.setState({
         email: e.target.value,
         emailValid: emailValid,
         patternValid: patternValid,
         disabled: !submitValid
      });  
   }


   handleMessageChange(e) {
      let messageValid = e.target.value ? true : false;
      let submitValid = this.state.nameValid && this.state.patternValid && this.state.emailValid && messageValid
      this.setState({
         messageText: e.target.value,
         messageValid: messageValid,
         disabled: !submitValid
      });
   }

   render() {

      if(this.props.data){
         var name = this.props.data.name;
         var city = this.props.data.address.city;
         var state = this.props.data.address.state;
         var zip = this.props.data.address.zip;
      }

      return (
         <section id="contact">

            <div className="row section-head">

               <div className="two columns header-col">

                  <h1><span>Get In Touch.</span></h1>

               </div>

            </div>

            <div className="row">
               <div className="eight columns">

                  <form id="contact" name="contact" method="POST">
                     <input type="hidden" name="form-name" value="contact" />
                     <div>
                        <label htmlFor="name">Name <span className="required">*</span></label>
                        <input type="text" id="name" name="name" value={this.state.name} onChange={this.handleNameChange}/>
                     </div>
                     <div>
                        <label htmlFor="email">Email <span className="required">*</span></label>
                        <input type="email" id="email" name="email" value={this.state.email} onChange={this.handleEmailChange}/>
                     </div>
                     <div>
                        <label htmlFor="message">Message <span className="required">*</span></label>
                        <textarea cols="50" rows="15" id="message" name="message" value={this.state.messageText} onChange={this.handleMessageChange}>
                        </textarea>
                     </div>
                     <div>
                        <button className="submit" disabled={this.state.disabled}>Submit</button>
                        <span id="image-loader">
                           <img alt="" src="images/loader.gif" />
                        </span>
                     </div>
				      </form>

               <div id="message-warning"> Error boy</div>
                     <div id="message-success">
                        <i className="fa fa-check"></i>Your message was sent, thank you!<br />
                     </div>
               </div>


               <aside className="four columns footer-widgets">
                  <div className="widget widget_contact">

                     <h4>Address and Phone</h4>
                     <p className="address">
                        {name}<br />
                        {city}, {state} {zip}<br />
                     </p>
                  </div>
               </aside>
         </div>
      </section>
      );
   }
}

export default Contact;
