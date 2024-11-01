import React from 'react'

const ConfirmEmail = () => {
    const handleCheckEmail = () => {
        window.open('mailto:gmail.com', '_blank')
    }
  return (
    <div className='container justify-content-center align-items-center d-flex vh-100'>
        <div className='card' style={{width:'30rem'}}>
            <div className='card-body'>
                <h2 className='card-title text-center'>Confirm Your Email</h2>
                <p className='card-text'>We have sent you an email to confirm your email.<br></br>
                 Please check your inbox or spam folder if you didn't receive it.</p>
                <button className='btn bg-primary' onClick={handleCheckEmail}>Check Email</button>
            </div>
        </div>
      
    </div>
  )
}

export default ConfirmEmail
