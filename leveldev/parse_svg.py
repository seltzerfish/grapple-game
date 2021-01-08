import re
import enum
import sys
import json
import dataclasses
from bs4 import BeautifulSoup

def str_to_rounded_int(s):
  return int(round(float(s)))

def get_fill(svg_shape):
  shape_style = svg_shape['style'].lower()
  hex_color = re.search(r'(?:^|;)fill:#([a-f0-9]{6})(?:$|;)', shape_style)
  if not hex_color:
    raise ValueError('No fill in style string {}'.format(shape_style))
  return hex_color.group(1)


class Shape(enum.IntEnum):
  RECT = 1
  CIRCLE = 2
  DOG = 3
  DEADLY = 4


COLOR_CODES = {
  '808080': Shape.RECT,  # 50% gray
  'ff00ff': Shape.DEADLY, # Magenta
  'ffcc00': Shape.DOG,  # golden yellow ish
}


@dataclasses.dataclass(frozen=True)
class Solid:
  x: int
  y: int
  width: int
  height: int
  shape: Shape


def solid_from_rect(rect):
  return Solid(x=str_to_rounded_int(rect['x']),
             y=str_to_rounded_int(rect['y']),
             width=str_to_rounded_int(rect['width']),
             height=str_to_rounded_int(rect['height']),
             shape=COLOR_CODES[get_fill(rect)])

def solid_from_circle(circle):
  return Solid(x=str_to_rounded_int(circle['cx']),
             y=str_to_rounded_int(circle['cy']),
             width=str_to_rounded_int(circle['r']),
             height=str_to_rounded_int(circle['r']),
             shape=Shape.CIRCLE)

CONVERTERS = {
  'rect': solid_from_rect,
  'circle': solid_from_circle
}


def parse_solids(soup):
  soup_solids = soup.svg.find('g', id='layer1')
  print(soup_solids.prettify())
  solids = []
  for shape in soup_solids.find_all(['rect', 'circle']):
    print(shape)
    solids.append(CONVERTERS[shape.name](shape))
  return solids


if __name__ == '__main__':
  input_filename = sys.argv[1]
  with open(input_filename, 'r') as xml_file:
    soup = BeautifulSoup(xml_file, 'xml')
  solids = parse_solids(soup)
  level_json = json.dumps({
    'solids': [solid.__dict__ for solid in solids]
  })

  output_filename = re.sub(r'\.svg$', '.json', input_filename)
  with open(output_filename, 'w') as json_file:
    json_file.write(level_json)
