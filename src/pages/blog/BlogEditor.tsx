import React, { useState, MutableRefObject } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import MpBlog from '../../entities/mpBlog';

interface Props {
  initialContent: string;
  blog: MpBlog;
  setBlog: (value: any) => void;
}

const BlogEditor: React.FC<Props> = ({
  initialContent,
  blog,
  setBlog,
}: Props) => {
  const handleEditorChange = (e: any) => {
    setBlog({ ...blog, bodyContent: e.target.getContent() });
  };
  return (
    <>
      <Editor
        apiKey="h8w63t9a24vhevl3i0lqz3x9cuhz59024y5sajxhwyiyox8u"
        initialValue={initialContent}
        init={{
          height: 700,
          menubar: true,
          plugins: [
            'advlist autolink lists link image',
            'charmap print preview anchor help',
            'searchreplace visualblocks code',
            'insertdatetime media table paste wordcount',
          ],
          toolbar:
            'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | help',
          font_formats:
            'Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Oswald=oswald; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats; Apercu=apercu;',
          content_style: "@import url('http://fonts.cdnfonts.com/css/apercu');",
        }}
        onChange={handleEditorChange}
      />
    </>
  );
};

export default BlogEditor;
