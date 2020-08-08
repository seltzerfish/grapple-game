import re
import sys
import json
import dataclasses
from bs4 import BeautifulSoup

@dataclasses.dataclass(frozen=True)
class Solid:
  x: int
  y: int
  width: int
  height: int

  @classmethod
  def from_svg_rect(cls, rect):
    return cls(x=int(rect['x']),
               y=int(rect['y']),
               width=int(rect['width']),
               height=int(rect['height']))


def parse_solids(soup):
  soup_solids = soup.svg.find('g', id='layer1')
  print(soup_solids.prettify())
  solids = []
  for rect in soup_solids.find_all('rect'):
    print(rect)
    solids.append(Solid.from_svg_rect(rect))
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
