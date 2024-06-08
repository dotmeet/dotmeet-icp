export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'createEvent' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text],
        [
          IDL.Variant({
            'Ok' : IDL.Record({
              'id' : IDL.Principal,
              'date' : IDL.Text,
              'name' : IDL.Text,
              'createdAt' : IDL.Nat64,
              'time' : IDL.Text,
              'description' : IDL.Text,
              'location' : IDL.Text,
            }),
            'Err' : IDL.Variant({ 'EventDoesNotExist' : IDL.Principal }),
          }),
        ],
        [],
      ),
    'deleteEvent' : IDL.Func(
        [IDL.Principal],
        [
          IDL.Variant({
            'Ok' : IDL.Record({
              'id' : IDL.Principal,
              'date' : IDL.Text,
              'name' : IDL.Text,
              'createdAt' : IDL.Nat64,
              'time' : IDL.Text,
              'description' : IDL.Text,
              'location' : IDL.Text,
            }),
            'Err' : IDL.Variant({ 'EventDoesNotExist' : IDL.Principal }),
          }),
        ],
        [],
      ),
    'fetchUpcomingEvents' : IDL.Func(
        [],
        [
          IDL.Vec(
            IDL.Record({
              'id' : IDL.Principal,
              'date' : IDL.Text,
              'name' : IDL.Text,
              'createdAt' : IDL.Nat64,
              'time' : IDL.Text,
              'description' : IDL.Text,
              'location' : IDL.Text,
            })
          ),
        ],
        ['query'],
      ),
    'readEventById' : IDL.Func(
        [IDL.Principal],
        [
          IDL.Opt(
            IDL.Record({
              'id' : IDL.Principal,
              'date' : IDL.Text,
              'name' : IDL.Text,
              'createdAt' : IDL.Nat64,
              'time' : IDL.Text,
              'description' : IDL.Text,
              'location' : IDL.Text,
            })
          ),
        ],
        ['query'],
      ),
    'readEvents' : IDL.Func(
        [],
        [
          IDL.Vec(
            IDL.Record({
              'id' : IDL.Principal,
              'date' : IDL.Text,
              'name' : IDL.Text,
              'createdAt' : IDL.Nat64,
              'time' : IDL.Text,
              'description' : IDL.Text,
              'location' : IDL.Text,
            })
          ),
        ],
        ['query'],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
