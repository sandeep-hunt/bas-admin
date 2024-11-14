import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Row, Form } from 'react-bootstrap';


export default function SiteSetting() {
  const [settingId, setSettingId] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const [formData, setFormData] = useState({
    site_title: '',
    site_keywords: '',
    site_description: '',
    site_copyright: '',
    contact_address: '',
    contact_mobile: '',
    contact_email: '',
    facebook_url: '',
    twitter_url: '',
    insta_url: '',
    linkedin_url: '',
    youtube_url: '',
    call_to_action: ''
  });

  const [siteLogo, setSiteLogo] = useState(null);
  const [siteFavicon, setSiteFavicon] = useState(null);
  const [siteSecondaryLogo, setSiteSecondaryLogo] = useState(null);

  const [imagePreviewLogo, setImagePreviewLogo] = useState("");
  const [imagePreviewFavicon, setImagePreviewFavicon] = useState("");
  const [imagePreviewSecondaryLogo, setImagePreviewSecondaryLogo] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setIsEdit(true);
  };

  const handleFileChange = (e) => {
    setIsEdit(true);
    const { name, files } = e.target;
    const file = files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (name === 'site_logo') {
          setSiteLogo(file);
          setImagePreviewLogo(reader.result);
        } else if (name === 'site_favicon') {
          setSiteFavicon(file);
          setImagePreviewFavicon(reader.result);
        } else if (name === 'site_secondary_logo') {
          setSiteSecondaryLogo(file);
          setImagePreviewSecondaryLogo(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      if (name === 'site_logo') {
        setImagePreviewLogo('');
      } else if (name === 'site_favicon') {
        setImagePreviewFavicon('');
      } else if (name === 'site_secondary_logo') {
        setImagePreviewSecondaryLogo('');
      }
    }
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(import.meta.env.VITE_BACKEND_API + 'setting', {
        headers: { Authorization: token },
      });

      if (response?.data) {
        const data = response.data?.result?.[0];
        setFormData({
          site_title: data.site_title || '',
          site_keywords: data.site_keywords || '',
          site_description: data.site_description || '',
          site_copyright: data.site_copyright || '',
          contact_address: data.contact_address || '',
          contact_mobile: data.contact_mobile || '',
          contact_email: data.contact_email || '',
          facebook_url: data.facebook_url || '',
          twitter_url: data.twitter_url || '',
          insta_url: data.insta_url || '',
          linkedin_url: data.linkedin_url || '',
          youtube_url: data.youtube_url || '',
          call_to_action: data.call_to_action || ''
        });
        setSettingId(data?.settings_id);
        setImagePreviewLogo(import.meta.env.VITE_BACKEND_API + data?.site_logo);
        setImagePreviewFavicon(import.meta.env.VITE_BACKEND_API + data?.site_favicon);
        setImagePreviewSecondaryLogo(import.meta.env.VITE_BACKEND_API + data?.site_secondary_logo);
      }
    } catch (error) {
      console.error('Error fetching Site Settings:', error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    if (siteLogo) {
      data.append('site_logo', siteLogo);
    }
    if (siteFavicon) {
      data.append('site_favicon', siteFavicon);
    }
    if (siteSecondaryLogo) {
      data.append('site_secondary_logo', siteSecondaryLogo);
    }

    try {
      const response = await axios.put(import.meta.env.VITE_BACKEND_API + `setting/update/${settingId}`, data, {
        headers: { Authorization: token },
      });
      alert(response?.data?.message);
    } catch (error) {
      if (error.response) {
        alert(`Error: ${error.response.data.error || 'An unexpected error occurred.'}`);
      } else if (error.request) {
        alert("No response from the server. Please try again later.");
      } else {
        alert("An error occurred while making the request. Please try again.");
      }
    }
  };

  return (
    <Container>
      <div className="bg-white border border-gray-500 w-full p-4 rounded shadow">
        <h4 className="text-lg font-semibold leading-5 mb-4">Site Settings</h4>

        <Card>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Row>
                {/* Site Title */}
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Site Title</Form.Label>
                    <Form.Control
                      type="text"
                      name="site_title"
                      value={formData.site_title}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>

                {/* Site Keywords */}
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Site Keywords</Form.Label>
                    <Form.Control
                      type="text"
                      name="site_keywords"
                      value={formData.site_keywords}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>

                {/* Site Description */}
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Site Description</Form.Label>
                    <Form.Control
                      type="text"
                      name="site_description"
                      value={formData.site_description}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>

                {/* Site Copyright */}
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Site Copyright</Form.Label>
                    <Form.Control
                      type="text"
                      name="site_copyright"
                      value={formData.site_copyright}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>

                {/* Contact Address */}
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Contact Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="contact_address"
                      value={formData.contact_address}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>

                {/* Contact Mobile */}
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Contact Mobile</Form.Label>
                    <Form.Control
                      type="text"
                      name="contact_mobile"
                      value={formData.contact_mobile}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>

                {/* Contact Email */}
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Contact Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="contact_email"
                      value={formData.contact_email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>

                {/* Social Media URLs */}
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Facebook URL</Form.Label>
                    <Form.Control
                      type="url"
                      name="facebook_url"
                      value={formData.facebook_url}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Twitter URL</Form.Label>
                    <Form.Control
                      type="url"
                      name="twitter_url"
                      value={formData.twitter_url}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Instagram URL</Form.Label>
                    <Form.Control
                      type="url"
                      name="insta_url"
                      value={formData.insta_url}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>LinkedIn URL</Form.Label>
                    <Form.Control
                      type="url"
                      name="linkedin_url"
                      value={formData.linkedin_url}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>YouTube URL</Form.Label>
                    <Form.Control
                      type="url"
                      name="youtube_url"
                      value={formData.youtube_url}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>

                {/* Site Favicon */}
                <Col md={4}>

                  <Form.Group className="mb-3">
                    <Form.Label>Site Favicon</Form.Label>
                    {imagePreviewFavicon && (
                      <div className="mb-3">
                        <img
                          src={imagePreviewFavicon}
                          alt="Preview"
                          style={{ width: '200px', height: '100px' }}
                        />
                      </div>
                    )}
                    <Form.Control
                      type="file"
                      name="site_favicon"
                      onChange={handleFileChange}
                    />
                  </Form.Group>
                </Col>

                {/* Site Logo */}
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Site Logo</Form.Label>
                    {imagePreviewLogo && (
                      <div className="mb-3">
                        <img
                          src={imagePreviewLogo}
                          alt="Preview"
                          style={{ width: '200px', height: '100px' }}
                        />
                      </div>
                    )}
                    <Form.Control
                      type="file"
                      name="site_logo"
                      onChange={handleFileChange}
                    />
                  </Form.Group>
                </Col>

                {/* Site Secondary Logo */}
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Site Secondary Logo</Form.Label>
                    {imagePreviewSecondaryLogo && (
                      <div className="mb-3">
                        <img
                          src={imagePreviewSecondaryLogo}
                          alt="Preview"
                          style={{ width: '200px', height: '100px' }}
                        />
                      </div>
                    )}
                    <Form.Control
                      type="file"
                      name="site_secondary_logo"
                      onChange={handleFileChange}
                    />
                  </Form.Group>
                </Col>

                {/* Call to Action */}
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Call to Action</Form.Label>
                    <Form.Control
                      type="text"
                      name="call_to_action"
                      value={formData.call_to_action}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>

                {/* Submit Button */}
                {<Col md={12}>
                  <Button type="submit" disabled={!isEdit}>Update Site Settings</Button>
                </Col>}
              </Row>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}
