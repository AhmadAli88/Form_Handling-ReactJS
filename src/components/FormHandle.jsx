import React, { useState, useRef } from 'react';

// UserForm component demonstrates various FormData use cases
const FormDataExamples = () => {
  const [previewImage, setPreviewImage] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);
  const [dynamicFields, setDynamicFields] = useState([{ id: 1, value: '' }]);
  const formRef = useRef(null);

  // 1. Basic Form Submission with FormData
  const handleBasicSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Log FormData entries
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/posts',
        {
          method: 'POST',
          body: formData,
        }
      );
      const data = await response.json();
      setApiResponse(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // 2. File Upload Handler with Preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Add file to FormData
      const formData = new FormData();
      formData.append('file', file);

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);

      // Optional: Upload file immediately
      uploadFile(formData);
    }
  };

  // 3. Multiple File Upload Handler
  const handleMultipleFiles = (e) => {
    const files = Array.from(e.target.files);
    const formData = new FormData();

    files.forEach((file, index) => {
      formData.append(`file${index}`, file);
    });

    // Additional metadata can be added
    formData.append('totalFiles', files.length);
    formData.append('uploadedAt', new Date().toISOString());

    // Upload files
    uploadFiles(formData);
  };

  // 4. Dynamic Form Fields Handler
  const addDynamicField = () => {
    setDynamicFields([
      ...dynamicFields,
      { id: dynamicFields.length + 1, value: '' },
    ]);
  };

  const handleDynamicFieldChange = (id, value) => {
    setDynamicFields(
      dynamicFields.map((field) =>
        field.id === id ? { ...field, value } : field
      )
    );
  };

  // 5. Form with Mixed Data Types
  const handleMixedDataSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Add complex data structure
    const complexData = {
      settings: {
        notifications: true,
        theme: 'dark',
      },
    };
    formData.append('complexData', JSON.stringify(complexData));

    // Add array data
    const arrayData = ['item1', 'item2', 'item3'];
    formData.append('arrayData', JSON.stringify(arrayData));

    // Log all data
    logFormData(formData);

    // Submit data
    await submitMixedData(formData);
  };

  // 6. FormData with File Validation
  const handleFileValidation = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 3 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        e.target.value = '';
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        alert('Only JPG, PNG & GIF files are allowed');
        e.target.value = '';
        return;
      }

      // If validation passes, create FormData
      const formData = new FormData();
      formData.append('validatedFile', file);
      formData.append('fileType', file.type);
      formData.append('fileSize', file.size);

      // Process valid file
      processValidatedFile(formData);
    }
  };

  // 7. Update Existing FormData
  const updateFormData = () => {
    const formData = new FormData(formRef.current);

    // Update existing field
    formData.set('username', 'updated_username');

    // Remove a field
    formData.delete('optional_field');

    // Check if field exists
    if (formData.has('email')) {
      console.log('Email field exists');
    }

    // Get all values of a field
    const allValues = formData.getAll('hobbies');
    console.log('All hobbies:', allValues);
  };

  // Utility Functions
  const logFormData = (formData) => {
    console.log('Form Data Contents:');
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
  };

  const uploadFile = async (formData) => {
    try {
      const response = await fetch('https://file.io', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      console.log('Upload successful:', data);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const uploadFiles = async (formData) => {
    // Similar to uploadFile but for multiple files
    console.log('Uploading multiple files...');
  };

  const submitMixedData = async (formData) => {
    // Handle mixed data submission
    console.log('Submitting mixed data...');
  };

  const processValidatedFile = (formData) => {
    // Process validated file
    console.log('Processing validated file...');
  };

  return (
    <div className='p-6'>
      {/* 1. Basic Form */}
      <section className='mb-8'>
        <h2 className='text-xl font-bold mb-4'>Basic Form</h2>
        <form onSubmit={handleBasicSubmit} ref={formRef}>
          <div className='space-y-4'>
            <input
              type='text'
              name='username'
              placeholder='Username'
              className='border p-2 rounded'
            />
            <input
              type='email'
              name='email'
              placeholder='Email'
              className='border p-2 rounded'
            />
            <button
              type='submit'
              className='bg-blue-500 text-white p-2 rounded'
            >
              Submit
            </button>
          </div>
        </form>
      </section>

      {/* 2. File Upload with Preview */}
      <section className='mb-8'>
        <h2 className='text-xl font-bold mb-4'>File Upload with Preview</h2>
        <input type='file' onChange={handleFileChange} className='mb-4' />
        {previewImage && (
          <img
            src={previewImage}
            alt='Preview'
            className='max-w-xs rounded shadow'
          />
        )}
      </section>

      {/* 3. Multiple File Upload */}
      <section className='mb-8'>
        <h2 className='text-xl font-bold mb-4'>Multiple File Upload</h2>
        <input
          type='file'
          multiple
          onChange={handleMultipleFiles}
          className='mb-4'
        />
      </section>

      {/* 4. Dynamic Fields Form */}
      <section className='mb-8'>
        <h2 className='text-xl font-bold mb-4'>Dynamic Fields</h2>
        {dynamicFields.map((field) => (
          <input
            key={field.id}
            type='text'
            value={field.value}
            onChange={(e) => handleDynamicFieldChange(field.id, e.target.value)}
            className='border p-2 rounded mb-2 block'
            placeholder={`Field ${field.id}`}
          />
        ))}
        <button
          onClick={addDynamicField}
          className='bg-green-500 text-white p-2 rounded'
        >
          Add Field
        </button>
      </section>

      {/* 5. Mixed Data Form */}
      <section className='mb-8'>
        <h2 className='text-xl font-bold mb-4'>Mixed Data Form</h2>
        <form onSubmit={handleMixedDataSubmit}>
          <input
            type='text'
            name='text_field'
            placeholder='Text Input'
            className='border p-2 rounded mb-2 block'
          />
          <input type='file' name='file_field' className='mb-2 block' />
          <select name='select_field' className='border p-2 rounded mb-2 block'>
            <option value='option1'>Option 1</option>
            <option value='option2'>Option 2</option>
          </select>
          <button
            type='submit'
            className='bg-purple-500 text-white p-2 rounded'
          >
            Submit Mixed Data
          </button>
        </form>
      </section>

      {/* 6. File Validation */}
      <section className='mb-8'>
        <h2 className='text-xl font-bold mb-4'>File Validation</h2>
        <input
          type='file'
          onChange={handleFileValidation}
          accept='image/jpeg,image/png,image/gif'
          className='mb-4'
        />
      </section>
    </div>
  );
};

export default FormDataExamples;
