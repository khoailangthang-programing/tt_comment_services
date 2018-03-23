# DOCS

1. Api thêm và sửa.

API | URI | METHOD | PARAMS | FORM OUTPUT |
--- | --- | --- | --- | --- |
Thêm | `/comments/create` | `POST` | `params_1` | `output_1` |
Sửa | `/comments/update` | `POST` | `params_2` | `output_2` |
Lấy danh sách comments| `/comments` | `GET` | `params_3` | `output_3` |
Lấy danh sách emoji| `/emoji` | `GET` | `params_4` | `output_4` |

#### `params_1`:

 - nid(required|int): id của news
 - uid(required|int): id của user
 - uname(required|string): username
 - reply_to(optional|int): id của comment
 - promoted(optional|(0-1)): ...
 - ip(required|ip): ip
 - content(required|text): Nội dung

#### `output_1`:
 - status(int|(0-1))
 - message(array)
 - data(array chứa object)

#### `params_2`:

 - cid(required|int): id của comment
 - uid(required|int): id của user
 - content(required|string): nội dung mới

#### `output_2`:
 - status(int|(0-1))
 - message(array)
 - data(array chứa object)

#### `params_3`:

 - nid(required|int): id của news
 - page(required|int|>0): số page 

#### `output_3`:
 - status(int|(0-1))
 - message(array)
 - data(array chứa object)

#### `params_4`:

#### `output_4`:
 - status(int|(0-1))
 - message(array)
 - data(array chứa object)